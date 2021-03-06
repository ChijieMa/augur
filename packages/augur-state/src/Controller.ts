import { Augur } from "@augurproject/api";
import { PouchDBFactoryType } from "./db/AbstractDB";
import { DB } from "./db/DB";
import { BlockAndLogStreamerListener } from "./db/BlockAndLogStreamerListener";

// because flexsearch is a UMD type lib
import FlexSearch = require("flexsearch");

const settings = require("@augurproject/state/src/settings.json");

// Need this interface to access these items on the documents in a SyncableDB
interface SyncableMarketDataDoc extends PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> {
  extraInfo: string;
  description: string;
}

export class Controller<TBigNumber> {
  public readonly FTS: FlexSearch;
  private dbController: DB<TBigNumber>;

  public constructor(
    private augur: Augur<TBigNumber>,
    private networkId: number,
    private blockstreamDelay: number,
    private defaultStartSyncBlockNumber: number,
    private trackedUsers: Array<string>,
    private pouchDBFactory: PouchDBFactoryType,
    private blockAndLogStreamerListener: BlockAndLogStreamerListener
  ) {
    this.FTS = FlexSearch.create({
      doc: {
        id: "id",
        start: "start",
        end: "end",
        field: [
          "title",
          "description",
          "tags",
        ],
      },
    });
  }

  public async run(): Promise<void> {
    try {
      this.dbController = await DB.createAndInitializeDB(
        this.networkId,
        this.blockstreamDelay,
        this.defaultStartSyncBlockNumber,
        this.trackedUsers,
        this.augur.genericEventNames,
        this.augur.userSpecificEvents,
        this.pouchDBFactory,
        this.blockAndLogStreamerListener,
      );
      await this.dbController.sync(
        this.augur,
        settings.chunkSize,
        settings.blockstreamDelay,
      );

      this.blockAndLogStreamerListener.listenForBlockRemoved(this.dbController.rollback.bind(this.dbController));
      this.blockAndLogStreamerListener.startBlockStreamListener();

      const marketCreatedDB = await this.dbController.getSyncableDatabase(this.dbController.getDatabaseName("MarketCreated"));
      const previousDocumentEntries = await marketCreatedDB.allDocs();

      for (let row of previousDocumentEntries.rows) {
        if (row === undefined) {
          continue;
        }

        const doc = row.doc as SyncableMarketDataDoc;

        if (doc) {
          const extraInfo = doc.extraInfo;
          const description = doc.description;

          if (extraInfo && description) {
            let info;
            try {
              info = JSON.parse(extraInfo);
            } catch (err) {
              console.error("Cannot parse document json: " + extraInfo);
            }

            if (info && info.tags && info.longDescription) {
              this.FTS.add({
                id: row.id,
                title: description,
                description: info.longDescription,
                tags: info.tags.toString(), // convert to comma separated so it is searchable
                start: new Date(),
                end: new Date(),
              });
            }
          }
        }
      }

      // TODO begin server process
    } catch (err) {
      console.log(err);
    }
  }
}
