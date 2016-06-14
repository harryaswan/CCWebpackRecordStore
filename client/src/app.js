var Store = require("./record_store/store.js");
var Collector = require("./record_store/collector.js");
var RecordStoreView = require("./record_store/recordstoreview.js");
var sample = require("./sample.js");

var main = function() {
    var store = null;
    var collector = null;

    var savedStore = localStorage.getItem("store");
    var savedCollector = localStorage.getItem("collector");

    if (savedStore && savedCollector) {
        var storeBits = JSON.parse(savedStore);
        var storeName = storeBits.name;
        var storeCity = storeBits.city;
        var storeBalance = storeBits.balance;
        var storeInventory = [];
        for (var i = 0; i < storeBits.inventory.items.length; i++) {
            storeInventory.push(storeBits.inventory.items[i]);
        }
        store = new Store(storeName, storeCity, storeInventory, storeBalance);
        console.log(store);

        var collectorBits = JSON.parse(savedCollector);
        var collectorName = collectorBits.name;
        var collectorBalance = collectorBits.balance;
        var collectorInventory = [];
        for (var i = 0; i < collectorBits.inventory.items.length; i++) {
            collectorInventory.push(collectorBits.inventory.items[i]);
        }
        collector = new Collector(collectorName, collectorInventory, collectorBalance);
        console.log(collector);
    } else {
        store = new Store("Colin's Music", "Glasgow", null, 20);
        collector = new Collector("Jimmy", null, 10);
        populatePeeps(store, collector);
    }

    var rsv = new RecordStoreView(document.getElementById('record_store'), store, collector);


    rsv.render();

    document.getElementById('save_button').onclick = function(e) {
        e.preventDefault();

        localStorage.setItem("store", JSON.stringify(store));
        localStorage.setItem("collector", JSON.stringify(collector));

    };



};

var populatePeeps = function(store, collector) {
    store.addRecord(sample[0]);
    store.addRecord(sample[1]);
    collector.addRecord(sample[2]);
    collector.addRecord(sample[3]);
};

window.onload = main;
