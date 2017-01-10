/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var constants = require("../../../src/constants");
var utils = require("../../../src/utilities");
var tools = require("../../tools");

require('it-each')({ testPerIteration: true });

describe("utilities.compose", function () {

    var test = function (t) {
        it(JSON.stringify(t), function () {
            var composition = utils.compose(t.prepare, t.callback);
            if (t.expected.type === Function) {
                assert.isTrue(utils.is_function(composition));
                assert.strictEqual(composition(t.input), t.expected.output);
            } else {
                assert.isNull(composition);
            }
        });
    };

    test({
        prepare: function (x, cb) {
            if (!utils.is_function(cb)) return 2*x;
            return cb(2*x);
        },
        callback: function (x) { return 3 + x; },
        input: 1,
        expected: {
            type: Function,
            output: 5
        }
    });
    test({
        prepare: function (x, cb) {
            if (!utils.is_function(cb)) return 2*x;
            return cb(2*x);
        },
        callback: function (x) { return 3 + x; },
        input: 7,
        expected: {
            type: Function,
            output: 17
        }
    });
    test({
        prepare: function (x, cb) {
            if (!utils.is_function(cb)) return 2*x;
            return cb(2*x);
        },
        callback: null,
        input: 1,
        expected: {type: null}
    });
    test({
        prepare: null,
        callback: null,
        input: 1,
        expected: {type: null}
    });
    test({
        prepare: undefined,
        callback: undefined,
        input: 1,
        expected: {type: null}
    });
    test({
        prepare: null,
        callback: function (x) { return 3 + x; },
        input: 1,
        expected: {
            type: Function,
            output: 4
        }
    });
});

describe("tools.linspace", function () {

    var test = function (t) {
        it(t.inputs.a + ", " + t.inputs.b + ", " + t.inputs.n, function () {
            var actual = tools.linspace(t.inputs.a, t.inputs.b, t.inputs.n);
            assert.deepEqual(actual, t.expected);
        });
    };

    test({
        inputs: {a: 0, b: 1, n: 2},
        expected: [0, 1]
    });
    test({
        inputs: {a: 0, b: 1, n: 3},
        expected: [0, 0.5, 1]
    });
    test({
        inputs: {a: 1, b: 5},
        expected: [1, 2, 3, 4, 5]
    });
    test({
        inputs: {a: 1, b: 5, n: 9},
        expected: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
    });
});

describe("utilities.is_function", function () {

    var test = function (t) {
        it(t.label + " -> " + t.expected, function () {
            assert.strictEqual(utils.is_function(t.input), t.expected);
        });
    };

    function ima_function() {
        console.log("I'm a function!");
    }

    test({
        label: "utils.unpack",
        input: utils.unpack,
        expected: true
    });
    test({
        label: "utils.labels",
        input: utils.labels,
        expected: true
    });
    test({
        label: "declared function",
        input: ima_function,
        expected: true
    });
    test({
        label: "function literal",
        input: test,
        expected: true
    });
    test({
        label: "anonymous function",
        input: function () { console.log("hello world!"); },
        expected: true
    });
    test({
        label: "Function",
        input: Function,
        expected: true
    });
    test({
        label: "Object",
        input: Object,
        expected: true
    });
    test({
        label: "5",
        input: 5,
        expected: false
    });
    test({
        label: "'5'",
        input: '5',
        expected: false
    });
    test({
        label: "'[object Function]'",
        input: "[object Function]",
        expected: false
    });
    test({
        label: "{}",
        input: {},
        expected: false
    });
    test({
        label: "{ hello: 'world' }",
        input: { hello: "world" },
        expected: false
    });
    test({
        label: "{ f: Function }",
        input: { f: Function },
        expected: false
    });
    test({
        label: "[]",
        input: [],
        expected: false
    });
    test({
        label: "[1, 2, 3]",
        input: [1, 2, 3],
        expected: false
    });
    test({
        label: "[Function]",
        input: [Function],
        expected: false
    });
    test({
        label: "utils.ARGUMENT_NAMES",
        input: utils.ARGUMENT_NAMES,
        expected: false
    });
    test({
        label: "constants.ETHER",
        input: constants.ETHER,
        expected: false
    });

});

describe("tools.remove_duplicates", function () {

    var test = function (t) {
        it(JSON.stringify(t.array) + " -> " + JSON.stringify(t.expected), function () {
            assert.deepEqual(tools.remove_duplicates(t.array), t.expected);
        });
    };

    test({
        array: [1, 1, 2, 3, 4],
        expected: [1, 2, 3, 4]
    });
    test({
        array: [1, "1", 2, 3, 4],
        expected: [1, "1", 2, 3, 4]
    });
    test({
        array: [1, 1, 1, 1, 1],
        expected: [1]
    });
    test({
        array: [2, 1, 1, 3, 4],
        expected: [2, 1, 3, 4]
    });
    test({
        array: ['a', 'b', 'c', 'c', 'c', 'c'],
        expected: ['a', 'b', 'c']
    });
    test({
        array: ['c', 'b', 'a', 'c', 'c', 'c'],
        expected: ['c', 'b', 'a']
    });
    test({
        array: ['abc', null, null, 'xyz', undefined],
        expected: ['abc', null, 'xyz', undefined]
    });
    test({
        array: [1, 2, 3],
        expected: [1, 2, 3]
    });
    test({
        array: [3, 2, 5],
        expected: [3, 2, 5]
    });
    test({
        array: [1, 2, 3, 'a', 'abc', 'ab'],
        expected: [1, 2, 3, 'a', 'abc', 'ab']
    });
    test({
        array: [],
        expected: []
    });
    test({
        array: [{}],
        expected: [{}]
    });
    test({
        array: [{}, {}],
        expected: [{}, {}]
    });
    test({
        array: [[]],
        expected: [[]]
    });
    test({
        array: [[], []],
        expected: [[], []]
    });

});

describe("utilities.labels", function () {

    it("should extract parameter names", function () {
        var fn = function (a, b, c, onSent, onSuccess, onFailed) {
            var params = utils.labels(fn);
            var expected = ['a', 'b', 'c', "onSent", "onSuccess", "onFailed"];
            assert.deepEqual(params, expected);
        };
        fn('x', 'y', 'z', console.log, console.log, console.log);
    });

});

describe("utilities.unpack", function () {

    var test = function (unpacked) {
        assert(unpacked.params);
        assert(unpacked.cb);
        assert.strictEqual(unpacked.params.constructor, Array);
        assert.strictEqual(unpacked.cb.constructor, Array);
        assert.strictEqual(unpacked.params.length, 4);
        assert.strictEqual(unpacked.cb.length, 3);
        assert.deepEqual(unpacked.params, ['w', 'x', 'y', 'z']);
        assert.deepEqual(unpacked.cb, [console.log, console.log, console.log]);
    };

    it("should unpack object argument", function () {
        var fn = function (a, b, c, d, onSent, onSuccess, onFailed, onConfirmed) {
            test(utils.unpack(a, utils.labels(fn)));
        };
        fn({
            a: 'w',
            b: 'x',
            c: 'y',
            d: 'z',
            onSent: console.log,
            onSuccess: console.log,
            onFailed: console.log
        });
    });

    it("should unpack positional arguments", function () {
        var fn = function (a, b, c, d, onSent, onSuccess, onFailed) {
            test(utils.unpack(a, utils.labels(fn), arguments));
        };
        fn('w', 'x', 'y', 'z', console.log, console.log, console.log);
    });

});

describe("utilities.serialize", function () {
    var test = function (t) {
        it(JSON.stringify(t.serializable) + " -> " + t.serialized, function () {
            assert.strictEqual(utils.serialize(t.serializable), t.serialized);
        });
    };
    test({
        serializable: [1, 2, 3],
        serialized: "000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003"
    });
    test({
        serializable: "0x07",
        serialized: "0000000000000000000000000000000000000000000000000000000000000007"
    });
    test({
        serializable: [7],
        serialized: "0000000000000000000000000000000000000000000000000000000000000007"
    });
    test({
        serializable: [1, 0, 1, 0, 1, 0, 1],
        serialized: "0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
    });
    test({
        serializable: [0, 0, 0, 0],
        serialized: "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        serializable: [17, 100, 2],
        serialized: "000000000000000000000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000002"
    });
    test({
        serializable: [17, 1000, 2],
        serialized: "000000000000000000000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000002"
    });
    test({
        serializable: ["0x01", "0x11"],
        serialized: "00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000011"
    });
    test({
        serializable: [1, 17],
        serialized: "00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000011"
    });
    test({
        serializable: ["0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b", "0x0f69b5", "0x041e"],
        serialized: "00000000000000000000000005ae1d0ca6206c6168b42efcd1fbe0ed144e821b00000000000000000000000000000000000000000000000000000000000f69b5000000000000000000000000000000000000000000000000000000000000041e"
    });    
    test({
        serializable: [
            0,
            "0xf69b5",
            1898028,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1"
        ],
        serialized: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f69b500000000000000000000000000000000000000000000000000000000001cf62c00000000000000000000000082a978b3f5962a5b0957d9ee9eef472ee55b42f1",
    });
    test({
        serializable: ["0x7400000000000000000000000000000000000000000000000000000000000000"],
        serialized: "7400000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        serializable: [0, "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1"],
        serialized: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082a978b3f5962a5b0957d9ee9eef472ee55b42f1"
    });
    test({
        serializable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030",
        ],
        serialized: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082a978b3f5962a5b0957d9ee9eef472ee55b42f10000000000000000000000003078313230303030303030303030303030303030"
    });
    test({
        serializable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030",
            "0xf69b5",
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e"
        ],
        serialized: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082a978b3f5962a5b0957d9ee9eef472ee55b42f1000000000000000000000000307831323030303030303030303030303030303000000000000000000000000000000000000000000000000000000000000f69b5a4603384f73c741ba7bc5249e106009d55653ffcbbf27ceede8cc980770341d2"
    });
    test({
        serializable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030",
            "0xf69b5",
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1,
            120
        ],
        serialized: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082a978b3f5962a5b0957d9ee9eef472ee55b42f1000000000000000000000000307831323030303030303030303030303030303000000000000000000000000000000000000000000000000000000000000f69b5a4603384f73c741ba7bc5249e106009d55653ffcbbf27ceede8cc980770341d200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000078"
    });
    test({
        serializable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030",
            "0xf69b5",
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1,
            120,
            "0x3078323035626330316133366532656232"
        ],
        serialized: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082a978b3f5962a5b0957d9ee9eef472ee55b42f1000000000000000000000000307831323030303030303030303030303030303000000000000000000000000000000000000000000000000000000000000f69b5a4603384f73c741ba7bc5249e106009d55653ffcbbf27ceede8cc980770341d2000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000780000000000000000000000000000003078323035626330316133366532656232"
    });
    test({
        serializable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030",
            "0xf69b5",
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1,
            120,
            "0x3078323035626330316133366532656232",
            2,
            1054
        ],
        serialized: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082a978b3f5962a5b0957d9ee9eef472ee55b42f1000000000000000000000000307831323030303030303030303030303030303000000000000000000000000000000000000000000000000000000000000f69b5a4603384f73c741ba7bc5249e106009d55653ffcbbf27ceede8cc980770341d20000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000007800000000000000000000000000000030783230356263303161333665326562320000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000041e"
    });
    test({
        serializable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030",
            "0xf69b5",
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1,
            120,
            "0x3078323035626330316133366532656232",
            2,
            1054,
            "0x3078353165623835316562383531656238"
        ],
        serialized: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082a978b3f5962a5b0957d9ee9eef472ee55b42f1000000000000000000000000307831323030303030303030303030303030303000000000000000000000000000000000000000000000000000000000000f69b5a4603384f73c741ba7bc5249e106009d55653ffcbbf27ceede8cc980770341d20000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000007800000000000000000000000000000030783230356263303161333665326562320000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000041e0000000000000000000000000000003078353165623835316562383531656238"
    });
    test({
        serializable: [1844674407370955100],
        serialized: "00000000000000000000000000000000000000000000000019999999999998f8"
    });
    test({
        serializable: [1844674407370955200],
        serialized: "0000000000000000000000000000000000000000000000001999999999999a24"
    });
    test({
        serializable: ["test"],
        serialized: "74657374"
    });
    test({
        serializable: "test",
        serialized: "74657374"
    });
    test({
        serializable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030", // initial liquidity
            "0xf69b5", // branch
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1, // numEvents
            120, // cumulative scale
            "0x3078323035626330316133366532656232", // alpha
            2, // numOutcomes
            1054, // tradingPeriod
            "0x3078353165623835316562383531656238", // tradingFee
            "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?"
        ],
        serialized: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082a978b3f5962a5b0957d9ee9eef472ee55b42f1000000000000000000000000307831323030303030303030303030303030303000000000000000000000000000000000000000000000000000000000000f69b5a4603384f73c741ba7bc5249e106009d55653ffcbbf27ceede8cc980770341d20000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000007800000000000000000000000000000030783230356263303161333665326562320000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000041e0000000000000000000000000000003078353165623835316562383531656238576861742077696c6c2074686520686967682074656d70657261747572652028696e20646567726565732046616872656e686569742920626520696e2053616e204672616e636973636f2c2043616c69666f726e69612c206f6e204a756c7920312c20323031363f"
    });
    test({
        serializable: ["radical-accelerations-56zrpywcyuv7vi"],
        serialized: "7261646963616c2d616363656c65726174696f6e732d35367a7270797763797576377669"
    });
    test({
        serializable: [0, "radical-accelerations-56zrpywcyuv7vi"],
        serialized: "00000000000000000000000000000000000000000000000000000000000000007261646963616c2d616363656c65726174696f6e732d35367a7270797763797576377669"
    });
    test({
        serializable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "radical-accelerations-56zrpywcyuv7vi"
        ],
        serialized: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082a978b3f5962a5b0957d9ee9eef472ee55b42f17261646963616c2d616363656c65726174696f6e732d35367a7270797763797576377669"
    });
});

describe("utilities.sha256", function () {
    var test = function (t) {
        it(JSON.stringify(t.hashable) + " -> " + t.digest, function () {
            assert.strictEqual(utils.sha256(t.hashable), t.digest);
        });
    };
    test({
        hashable: [1, 2, 3],
        digest: "-0x6db4020772ce75dc29791ac402ffe01861328e29a9405a892e760684753eb441"
    });
    test({
        hashable: "0x07",
        digest: "0x77982011336d915790e77d8301a52da5654857a870de65fb16d0cb1a44820b9c"
    });
    test({
        hashable: [7],
        digest: "0x77982011336d915790e77d8301a52da5654857a870de65fb16d0cb1a44820b9c"
    });
    test({
        hashable: [1, 0, 1, 0, 1, 0, 1],
        digest: "0x26510696aacdcede7ac75a2fe403a6c5f2239e0935c2a14bb8516b0313259bb5"
    });
    test({
        hashable: [0, 0, 0, 0],
        digest: "0x67f022195ee405142968ca1b53ae2513a8bab0404d70577785316fa95218e8ba"
    });
    test({
        hashable: [17, 100, 2],
        digest: "0x7754170191064ef0aa54c18ea413326f0aefa898c03eb5651abeb1f02bb2772a"
    });
    test({
        hashable: [17, 1000, 2],
        digest: "0x12c712bd101ec252e2c7f2dd6249c118a604abdfa270f04d2ccefe091df70f24"
    });
    test({
        hashable: ["0x01", "0x11"],
        digest: "0x7a0368ef83bc9ae7912ebfc52afa1fa41fc4ecab754e60137bb0dea6681de265"
    });
    test({
        hashable: [1, 17],
        digest: "0x7a0368ef83bc9ae7912ebfc52afa1fa41fc4ecab754e60137bb0dea6681de265"
    });
    test({
        hashable: ["0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b", "0x0f69b5", "0x041e"],
        digest: "-0x1aca611fbe5cba1f22bed65740bcf56c5c74f7312d99a546b16b5c5448532406"
    });    
    test({
        hashable: [
            0,
            "0xf69b5",
            1898028,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
        ],
        digest: "-0x810d6e81e51b35a4ee7c236a382c013b4ee60e6366d349a160ec67db7b873a",
    });
    test({
        hashable: ["0x7400000000000000000000000000000000000000000000000000000000000000"],
        digest: "0x7ff93b83c31a8d2f1d12ab3ac4bb212b51e63dea796528471343a34f9448ff50"
    });
    test({
        hashable: ["test"],
        digest: "-0x4149eb417dbc5fe936227211fd130ffb561775c7ff7320aa4688f5baf9f4fd36"
    });
    test({
        hashable: "test",
        digest: "-0x4149eb417dbc5fe936227211fd130ffb561775c7ff7320aa4688f5baf9f4fd36"
    });
    test({
        hashable: [0, "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1"],
        digest: "-0x34a341c67687d8449b12dcbceed3d01ed33fd6a15ee973771287a199593354e2"
    });
    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030",
        ],
        digest: "-0x3d4fbdd679ca32da847bff591cd22eac3386430c18cbef74c71b2419d23cbc8c"
    });
    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030",
            "0xf69b5",
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e"
        ],
        digest: "0xe7e9d110b87524e8ff3c3fbaebe1f0b8d0ca149a38fc20bf91992bc0bfd5235"
    });
    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030",
            "0xf69b5",
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1,
            120
        ],
        digest: "0x4a2e05b8a4cb6964049429966f6cf70360fe61bb40f421f7056475810783f00d"
    });
    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030",
            "0xf69b5",
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1,
            120,
            "0x3078323035626330316133366532656232"
        ],
        digest: "-0x9fa5bf78a1cabb1f3d94b86b9b4c6bfc28baf2e511ff59fb33a636266b7d4ef"
    });
    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030", // initial liquidity
            "0xf69b5", // branch
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1, // numEvents
            120, // cumulative scale
            "0x3078323035626330316133366532656232", // alpha
            2, // numOutcomes
            1054
        ],
        digest: "0x1b2c7fceac62ef762590b8b058ee2143c78889a74f7856dd54ea91e4cc1c8f75"
    });
    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030", // initial liquidity
            "0xf69b5", // branch
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1, // numEvents
            120, // cumulative scale
            "0x3078323035626330316133366532656232", // alpha
            2, // numOutcomes
            1054, // tradingPeriod
            "0x3078353165623835316562383531656238"
        ],
        digest: "0x5b1a0ae47238a4e1e264bfb27329f40f36df030c1022add9aa638b18821e6db8"
    });
    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030", // initial liquidity
            "0xf69b5", // branch
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1, // numEvents
            120, // cumulative scale
            "0x3078323035626330316133366532656232", // alpha
            2, // numOutcomes
            1054, // tradingPeriod
            "0x3078353165623835316562383531656238", // tradingFee
            "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?"
        ],
        digest: "0x49419e3f50f7af3ef5300ee8cc2556903585f538550a7805b5a1fadb86851792"
    });
    test({
        hashable: ["radical-accelerations-56zrpywcyuv7vi"],
        digest: "0x5dc476bd51d117f11ed479c1a72ab923504e8de029835365f014ba86be5a3791"
    });
    test({
        hashable: [0, "radical-accelerations-56zrpywcyuv7vi"],
        digest: "0x62ab9f23b1c33cc8d6ee6e15ca7fdc39b316334f5fbf420487ee86c626eee00"
    });
    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "radical-accelerations-56zrpywcyuv7vi"
        ],
        digest: "-0x75943224e77cdf3ebe945085de00dc0aa34672c24bd93e1234dc95ffce68c88a"
    });
    test({
        hashable: [1844674407370955100],
        digest: "0x46bcc7c2725c2854bd83658adf0bf381e27e90f447dfd45eed498b68256280b4"
    });
    test({
        hashable: [1844674407370955200],
        digest: "-0x5ffec4d5b9bda3bc0a347137093725aa813f307713495c5aa02e0399bda74c40"
    });
});

describe("utilities.sha3", function () {
    var test = function (t) {
        it(JSON.stringify(t.hashable) + " -> " + t.digest, function () {
            assert.strictEqual(utils.sha3(t.hashable), t.digest);
        });
    };
    test({
        hashable: [1, 2, 3],
        digest: abi.unfork("0x6e0c627900b24bd432fe7b1f713f1b0744091a646a9fe4a65a18dfed21f2949c", true)
    });
    test({
        hashable: [1, 0, 1, 0, 1, 0, 1],
        digest: abi.unfork("0x1c9ace216ac502aa2f386dcce536fe05590090d2cd93768cf21f865677c2da96", true)
    });
    test({
        hashable: [7],
        digest: abi.unfork("-0x599336d74a1247d50642b66dd6abeaa5484f6bd96b415b31bb99e26578c93978", true)
    });
    test({
        hashable: [0, 0, 0, 0],
        digest: abi.unfork("0x12893657d8eb2efad4de0a91bcd0e39ad9837745dec3ea923737ea803fc8e3d", true)
    });
    test({
        hashable: [17, 100, 2],
        digest: abi.unfork("0x72f4bbc5353724cebd20d6f15e3d2bd10e75ed59cec54724ab5a6d5ad9955d3", true)
    });
    test({
        hashable: [17, 1000, 2],
        digest: abi.unfork("-0xfa1338534aa300ca79cf8b1123ed99a9634b1f9e475b24ea0c7a659ae701378", true)
    });
    test({
        hashable: ["0x01", "0x11"],
        digest: abi.unfork("0x17bc176d2408558f6e4111feebc3cab4e16b63e967be91cde721f4c8a488b552", true)
    });
    test({
        hashable: ["0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b", "0x0f69b5", "0x041e"],
        digest: abi.unfork("0x74d1c32fb4ba921c884e82504171fcc503c4488680dcd68f61af2e4732daa191", true)
    });    
    test({
        hashable: [
            0,
            "0xf69b5",
            1898028,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
        ],
        digest: abi.unfork("-0xec24e44d7005689c9e1ccbfecfcedb2665abe2940e585659600fcb896574dc7", true)
    });
    test({
        hashable: [
            0,
            "0xf69b5",
            1898028,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            abi.fix(42, "hex"),
            0,
            120,
            2
        ],
        digest: abi.unfork("0x751b23d114539a8c91a7b0671820324fc6300ab4ef1e090db5c71dd0d1dd0e14", true)
    });
    test({
        hashable: ["0x7400000000000000000000000000000000000000000000000000000000000000"],
        digest: abi.unfork("-0x1cf1192d502c2567785a27e617208c466a1fad592636b17ee99448dec3784481", true)
    });
    test({
        hashable: [
            0,
            "0xf69b5",
            1898028,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            abi.fix(42, "hex"),
            0,
            120,
            2,
            "test"
        ],
        digest: abi.unfork("-0x30ad844951eec4d0b5d543252391a6d4bb23b9f67f406f3f8a4203652b0d8cb3", true)
    });
    test({
        hashable: [
            0,
            "0xf69b5",
            1898028,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            abi.fix(42, "hex"),
            0,
            120,
            2,
            "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?"
        ],
        digest: abi.unfork("0x4da29b50a48cab4bd45d4bbef3a671083467a415109896a35c8e390bc561b237", true)
    });
    test({
        hashable: ["为什么那么认真？"],
        digest: abi.unfork("-0x19f33f90843772d67526450f0e0cf15ab06020001a2ae7c6437fcbee24257d6e", true)
    });
    test({
        hashable: ["なぜそんなに真剣なんだ？ €☃..."],
        digest: abi.unfork("0x2f77daf73854def6e1ed2edc9ed222f94387e1f2438f960720e96e902a6b20d2", true)
    });
    test({
        hashable: [
            "0x1708aec800",
            "0x51eb851eb851eb8",
            "0x574aad9e",
            "0x7765617468657200000000000000000000000000000000000000000000000000",
            "0x74656d7065726174757265000000000000000000000000000000000000000000",
            "0x636c696d617465206368616e6765000000000000000000000000000000000000",
            "0x159823db800",
            "0x18",
            "为什么那么认真？"
        ],
        digest: abi.unfork("0x2e7cf821ee4c26d268ed5a11a187efa9baa417544159759c1ab310868b5a4dfb", true)
    });
    test({
        hashable: [
            "0x1708aec800",
            "0x51eb851eb851eb8",
            "0x574aad9e",
            "0x7765617468657200000000000000000000000000000000000000000000000000",
            "0x74656d7065726174757265000000000000000000000000000000000000000000",
            "0x636c696d617465206368616e6765000000000000000000000000000000000000",
            "0x159823db800",
            "0x2e",
            "なぜそんなに真剣なんだ？ €☃..."
        ],
        digest: abi.unfork("0x2901f3d513d2259272700e2487c075e50c206a24069a3c83eb19de1738439508", true)
    });
    test({
        hashable: "-0x076627fd562b1cc22a6e53ae38d5d421fb3af7fe6c1f18164d097100fba627c54",
        digest: abi.unfork("-0x1de19444afd83f9be817472f4dc48418cbe33a43a02c2288c5b4ebb12aafc147", true)
    });
});
