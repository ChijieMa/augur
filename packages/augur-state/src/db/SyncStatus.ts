import { AbstractDB } from './AbstractDB';

interface SyncDocument {
  blockNumber: number;
}

export class SyncStatus extends AbstractDB {
    private defaultStartSyncBlockNumber: number;

    constructor(networkId: number, defaultStartSyncBlockNumber: number) {
        super(networkId, networkId + "-SyncStatus");
        this.defaultStartSyncBlockNumber = defaultStartSyncBlockNumber;
    }

    public async setHighestSyncBlock(dbName: string, blockNumber: number): Promise<PouchDB.Core.Response> {
        const document: SyncDocument = { blockNumber };
        return await this.upsertDocument(dbName, document);
    }

    public async getHighestSyncBlock(dbName: string): Promise<number> {
        const document = await this.getDocument<SyncDocument>(dbName);
        if (document) return document.blockNumber;
        return this.defaultStartSyncBlockNumber;
    }
}
