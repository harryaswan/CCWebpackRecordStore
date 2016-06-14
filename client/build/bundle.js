/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Store = __webpack_require__(1);
	var Collector = __webpack_require__(4);
	var RecordStoreView = __webpack_require__(5);
	var sample = __webpack_require__(6);
	
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Inventory = __webpack_require__(2);
	
	var Store = function(name, city, startingInventory, startingBalance) {
	    this.name = name;
	    this.city = city;
	    this.inventory = new Inventory();
	    this.balance = startingBalance;
	    if (startingInventory) {
	        this.addRecord(startingInventory);
	    }
	};
	
	Store.prototype = {
	    addRecord: function() {
	        this.inventory.addItem(arguments);
	    },
	    stockLevels: function() {
	        return this.inventory.length();
	    },
	    listInventory: function() {
	        this.inventory.list();
	    },
	    findRecord: function(name) {
	        return this.inventory.findItem(name);
	    },
	    sellRecord: function(record) {
	        return this.inventory.sell(this, record);
	    },
	    buyRecord: function(record, seller) {
	        this.inventory.buy(this, seller, record);
	    },
	    inventoryValue: function() {
	        return this.inventory.value();
	    },
	    report: function() {
	        return {cash: this.balance, stock: this.inventoryValue()};
	    }
	};
	
	module.exports = Store;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Record = __webpack_require__(3);
	
	var Inventory = function() {
	    this.items = [];
	};
	
	Inventory.prototype = {
	    addItem: function() {
	        var args = arguments[0];
	        for (var i = 0; i < args.length; i++) {
	            if (args[i]) {
	                if (args[i] instanceof Array) {
	                    for (var a = 0; a < args[i].length; a++) {
	                        this.items.push(args[i][a]);
	                    }
	                } else {
	                    this.items.push(args[i]);
	                }
	            }
	        }
	
	
	    },
	    removeItem: function() {
	        for (var i = 0; i < arguments.length; i++) {
	            this.items.splice(this.items.indexOf(arguments[i]), 1);
	        }
	    },
	    findItem: function(val) {
	        for (var i = 0; i < this.items.length; i++) {
	            if (this.items[i].title === val) {
	                return this.items[i];
	            } else if (this.items[i].barcode === parseInt(val)) {
	                return this.items[i];
	            }
	        }
	    },
	    buy: function(buyer, seller, item) {
	        var r = seller.inventory.checkIfItem(item);
	        if (r) {
	            if (buyer.balance >= r.price) {
	                var ra = seller.sellRecord(r);
	
	                if (ra) {
	                    buyer.addRecord(ra);
	                    buyer.balance -= r.price;
	                }
	            }
	        }
	    },
	    sell: function(seller, item) {
	        var r = seller.inventory.checkIfItem(item);
	        if (r instanceof Record) {
	            seller.balance += r.price;
	            return this.items.splice(this.items.indexOf(r), 1)[0];
	        } else {
	            return false;
	        }
	    },
	    checkIfItem: function(item) {
	        var r = item;
	        if (!(item instanceof Record)) {
	            r = this.findItem(item);
	        }
	        return r;
	    },
	    length: function() {
	        return this.items.length;
	    },
	    list: function() {
	        for (var i = 0; i < this.items.length; i++) {
	            console.log("#" + i, this.items[i]);
	        }
	    },
	    value: function() {
	        var val = 0;
	        for (var i = 0; i < this.items.length; i++) {
	            val += this.items[i].price;
	        }
	        return val;
	    }
	};
	
	module.exports = Inventory;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Record = function(name, title, price, barcode) {
	    this.name = name;
	    this.title = title;
	    this.price = parseInt(price);
	    this.barcode = parseInt(barcode);
	};
	
	module.exports = Record;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Inventory = __webpack_require__(2);
	
	var Collector = function(name, startingInventory, startingBalance) {
	    this.name = name;
	    this.balance = startingBalance;
	    this.inventory = new Inventory();
	    if (startingInventory) {
	        this.addRecord(startingInventory);
	    }
	};
	
	Collector.prototype = {
	    addRecord: function() {
	        this.inventory.addItem(arguments);
	    },
	    findRecord: function(name) {
	        return this.inventory.findItem('title', name);
	    },
	    buyRecord: function(record_title, store) {
	        this.inventory.buy(this, store, record_title);
	    },
	    sellRecord: function(record) {
	        return this.inventory.sell(this, record);
	    }
	};
	
	module.exports = Collector;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Record = __webpack_require__(3);
	var RecordStoreView = function(container, store, collector) {
	    this.container = container;
	    this.store = store;
	    this.collector = collector;
	
	
	    this.create();
	};
	
	RecordStoreView.prototype = {
	    render: function() {
	        this.displayInfo('store');
	        this.displayInfo('collector');
	        this.displayInventory('store');
	        this.displayInventory('collector');
	    },
	    displayInfo: function(who) {
	        var balanceEl = document.getElementById(who+'-balance');
	        var t = who;
	        t = t[0].toUpperCase() + t.substring(1);
	        balanceEl.innerHTML = t + " Balance £" + Math.round(this[who].balance * 100) / 100;
	        balanceEl.innerHTML += " - <i>Value £"+Math.round(this[who].inventory.value() * 100) / 100+"</i>";
	
	        var infoEl = document.getElementById(who + '-info');
	
	        infoEl.innerHTML = "Name:";
	        infoEl.innerHTML += "<b id='collector-name' contenteditable='true'>"+ this[who].name +"</b>";
	        infoEl.childNodes[1].onkeydown = function(e) {
	            this[who].name = e.target.innerText;
	        }.bind(this);
	
	
	    },
	    displayInventory: function(who) {
	        var ulName = who + "-inventory";
	        var dispCont = document.getElementById(ulName);
	        this.clearElement(dispCont);
	
	        for (var i = 0; i < this[who].inventory.items.length; i++) {
	            var li = document.createElement('li');
	            li.setAttribute('barcode', this[who].inventory.items[i].barcode);
	            li.setAttribute('seller', who);
	            li.setAttribute('draggable', true);
	            li.ondragstart = function(e) {
	                e.dataTransfer.setData("barcode", e.target.getAttribute("barcode"));
	                e.dataTransfer.setData("seller", e.target.getAttribute("seller"));
	            };
	            li.innerHTML = "<i>" + this[who].inventory.items[i].name + "</i> - <b>" + this[who].inventory.items[i].title + "</b> - £" + this[who].inventory.items[i].price;
	
	            var btn = document.createElement('button');
	            btn.setAttribute('seller', who);
	            btn.innerText = "Sell";
	            btn.onclick = function(e) {
	                var t = e.target.parentNode.getAttribute('barcode');
	                var seller = null, collector = null;
	                if (e.target.getAttribute('seller') === "store") {
	                    seller = this.store;
	                    buyer = this.collector;
	                } else {
	                    seller = this.collector;
	                    buyer = this.store;
	                }
	                buyer.buyRecord(t, seller);
	                this.render();
	            }.bind(this);
	
	            li.appendChild(btn);
	
	            dispCont.appendChild(li);
	        }
	    },
	    create:function() {
	        var elements = [];
	
	        // elements.push(this.createElement('button', 'addInterest', 'Add Interest'));
	        // elements.push(this.createElement('button', 'reset', 'Reset'));
	        //
	        // elements[0].onclick = function() {
	        //     this.addInterest();
	        // }.bind(this);
	        // elements[1].onclick = function() {
	        //     console.log("RESET....");
	        // };
	
	        var section1 = this.createElement('div', 'storeContainer', this.createElement('h4', 'store-balance', null));
	        section1.appendChild(this.createElement('h3', 'store-info', null));
	        section1.appendChild(this.createElement('ul', 'store-inventory', null));
	
	        var t = section1.childNodes[2];
	        t.ondragenter = function(e) {
	            e.preventDefault();
	        };
	        t.ondragover = function(e) {
	            e.preventDefault();
	        };
	        t.ondrop = function(e) {
	            this.onDropFunction(e);
	        }.bind(this);
	        elements.push(section1);
	
	        var section2 = this.createElement('div', 'collectorContainer', this.createElement('h4', 'collector-balance', null));
	        section2.appendChild(this.createElement('h3', 'collector-info', null));
	        section2.appendChild(this.createElement('ul', 'collector-inventory', null));
	
	        t = section2.childNodes[2];
	        t.ondragenter = function(e) {
	            e.preventDefault();
	        };
	        t.ondragover = function(e) {
	            e.preventDefault();
	        };
	        t.ondrop = function(e) {
	            this.onDropFunction(e);
	        }.bind(this);
	
	        elements.push(section2);
	
	        /* form inputs */
	        var form = this.createElement('form', 'record-form', null);
	
	        var nameIn = this.createElement('input', 'record-form-name', null);
	        nameIn.setAttribute('type', 'text');
	        nameIn.setAttribute('placeholder', 'Artist Name');
	        var nameLabel = document.createElement('label');
	        nameLabel.innerText = "Name:";
	
	        var titleIn = this.createElement('input', 'record-form-title', null);
	        titleIn.setAttribute('type', 'text');
	        titleIn.setAttribute('placeholder', 'Album Name');
	        var titleLabel = document.createElement('label');
	        titleLabel.innerText = "Title:";
	
	        var priceIn = this.createElement('input', 'record-form-price', null);
	        priceIn.setAttribute('type', 'number');
	        priceIn.setAttribute('placeholder', '5.99');
	        var priceLabel = document.createElement('label');
	        priceLabel.innerText = "Price: £";
	
	        var barcodeIn = this.createElement('input', 'record-form-barcode', null);
	        barcodeIn.setAttribute('type', 'number');
	        barcodeIn.setAttribute('placeholder', 'xxxxxxxx');
	        var barcodeLabel = document.createElement('label');
	        barcodeLabel.innerText = "Barcode:";
	
	        var goBtn = this.createElement('button', 'saveRecord', 'Save');
	        goBtn.onclick = function(e) {
	            e.preventDefault();
	            var name = document.getElementById('record-form-name');
	            var title = document.getElementById('record-form-title');
	            var price = document.getElementById('record-form-price');
	            var barcode = document.getElementById('record-form-barcode');
	            if (name && title && price && barcode) {
	                this.store.addRecord(new Record(name.value, title.value, parseInt(price.value), parseInt(barcode.value)));
	                name.value = null;
	                title.value = null;
	                price.value = null;
	                barcode.value = null;
	                this.render();
	            } else {
	                console.log("input missing");
	            }
	        }.bind(this);
	
	        form.appendChild(nameLabel);
	        form.appendChild(nameIn);
	        form.appendChild(titleLabel);
	        form.appendChild(titleIn);
	        form.appendChild(priceLabel);
	        form.appendChild(priceIn);
	        form.appendChild(barcodeLabel);
	        form.appendChild(barcodeIn);
	        form.appendChild(goBtn);
	        /* end of form inputs */
	        elements.push(form);
	        for (var i = 0; i < elements.length; i++) {
	            this.container.appendChild(elements[i]);
	        }
	
	    },
	    clearElement: function(element) {
	        while (element.firstChild) {
	            element.removeChild(element.firstChild);
	        }
	    },
	    createElement:function(type, id, inner) {
	        var tmp = document.createElement(type);
	        tmp.setAttribute('id', id);
	        if (inner instanceof Node) {
	            tmp.appendChild(inner);
	        } else {
	            tmp.innerHTML = inner;
	        }
	        return tmp;
	    },
	    onDropFunction: function(e) {
	        e.preventDefault();
	        var barcode = e.dataTransfer.getData("barcode");
	        var sellerText = e.dataTransfer.getData("seller");
	        var seller = null, collector = null;
	        if (sellerText === "store") {
	            seller = this.store;
	            buyer = this.collector;
	        } else {
	            seller = this.collector;
	            buyer = this.store;
	        }
	        buyer.buyRecord(parseInt(barcode), seller);
	        this.render();
	        return false;
	    }
	};
	
	module.exports = RecordStoreView;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Record = __webpack_require__(3);
	
	var records = [];
	
	records.push(new Record('Elbow', 'Seldom Seen Kid', 9.99, 11111111));
	records.push(new Record('Train', 'Bulletproof Picasso', 3.99, 22222222));
	records.push(new Record('AC/DC', 'Black Ice', 4.05, 33333333));
	records.push(new Record('Vandaveer', 'Oh, Willie, Please...', 3, 44444444));
	
	
	module.exports = records;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map