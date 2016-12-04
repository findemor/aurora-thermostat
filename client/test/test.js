/**
Depuracion con mocha en el nivel de src/:

	mocha --debug-brk

*/
var expect = require('expect.js'),
    assert = require('assert');


var Checker = require("../bll/checker.js")

var mocks = require("./mocks.js")
    db = mocks.db(),
    checker = Checker({}, mocks.current, db, mocks.log());

    addSchedules(db);    //añadimos los programas

describe("Starting from OFF...", function() {

    beforeEach(function(done) {
         //empezamos desde el estado de apagado
         mocks.current.status = {
			temp_external: 0,
			temp_indoor: 0,
			temp_desired: 0,
			mode: "OFF",
			status: "OFF",
			schedule: null
		 };

         checker.execute(false, function() {
             expect(mocks.current.status.status).to.be.equal("OFF");
             expect(mocks.current.board.relay.v()).to.be(false);
             done();
         });

    });

    performAllTestFrom("OFF", mocks, checker);
});

describe("Starting from ON status OFF...", function() {

    beforeEach(function(done) {
         //empezamos desde el estado de encendido
         mocks.current.board.temp = mocks.TEMP(21);
         mocks.current.status = {
			temp_external: 0,
			temp_indoor: 0,
			temp_desired: 20,
			mode: "ON",
			status: "ON",
			schedule: null
		 };

         checker.execute(false, function() {

         expect(mocks.current.status.status).to.be.equal("OFF");
         expect(mocks.current.board.relay.v()).to.be(false);
         done();
     });
    });

    performAllTestFrom("ON&OFF", mocks, checker);
});

describe("Starting from ON status ON...", function() {

    beforeEach(function(done) {
         //empezamos desde el estado de encendido
         mocks.current.board.temp = mocks.TEMP(15);
         mocks.current.status = {
			temp_external: 0,
			temp_indoor: 0,
			temp_desired: 20,
			mode: "ON",
			status: "ON",
			schedule: null
		 };

         checker.execute(false, function() {

         expect(mocks.current.status.status).to.be.equal("ON");
         expect(mocks.current.board.relay.v()).to.be(true);
         done();
     });
    });

    performAllTestFrom("ON&ON", mocks, checker);
});


describe("Starting from SCHEDULE[today-22h] status ON...", function() {

    beforeEach(function(done) {
         //empezamos desde el estado de programa
         mocks.current.status = {
			temp_external: 0,
			temp_indoor: 0,
			temp_desired: 0,
			mode: "SCHEDULE",
			status: "ON",
			schedule: null
		 };

         mocks.current.board.temp = mocks.TEMP(15);
         mocks.current.status.mode = "SCHEDULE";
         mocks.current.now = function() { return new Date("2016-11-03T22:00:00"); };  

         checker.execute(false, function() {
         expect(mocks.current.status.status).to.be.equal("ON");
         expect(mocks.current.board.relay.v()).to.be(true);
         expect(mocks.current.status.schedule.name).to.be("today-22h");
         done();
     });
    });

    performAllTestFrom("SCHEDULE[today-22h]&ON", mocks, checker);
});


describe("Starting from SCHEDULE[today-22h] status OFF...", function() {

    beforeEach(function(done) {
         //empezamos desde el estado de programa
         mocks.current.status = {
			temp_external: 0,
			temp_indoor: 0,
			temp_desired: 0,
			mode: "SCHEDULE",
			status: "OFF",
			schedule: null
		 };

         mocks.current.board.temp = mocks.TEMP(30);
         mocks.current.status.mode = "SCHEDULE";
         mocks.current.now = function() { return new Date("2016-11-03T22:00:00"); };  

         checker.execute(false, function() {
         expect(mocks.current.status.status).to.be.equal("OFF");
         expect(mocks.current.board.relay.v()).to.be(false);
         expect(mocks.current.status.schedule.name).to.be("today-22h");
         done();
     });
     });

    performAllTestFrom("SCHEDULE[today-22h]&OFF", mocks, checker);
});

describe("Starting from SCHEDULE[null] status OFF...", function() {

    beforeEach(function(done) {
         //empezamos desde el estado de programa
         mocks.current.status = {
			temp_external: 0,
			temp_indoor: 0,
			temp_desired: 0,
			mode: "SCHEDULE",
			status: "OFF",
			schedule: null
		 };

         mocks.current.board.temp = mocks.TEMP(5);
         mocks.current.status.mode = "SCHEDULE";
         mocks.current.now = function() { return new Date("2017-11-03T22:00:00"); };  //no matches

         checker.execute(false, function() {
         expect(mocks.current.status.status).to.be.equal("OFF");
         expect(mocks.current.board.relay.v()).to.be(false);
         expect(mocks.current.status.schedule).to.be(null);
         done();
     });
    });

    performAllTestFrom("SCHEDULE[null]&OFF", mocks, checker);
});

function addSchedules(db) {
    db.putSchedule({
        "name": "everyday-14h",
        "start": new Date("2007-11-03T13:00:00"),
        "end":   new Date("2007-11-03T15:00:00"),
        "temp_desired": 23,
        "repeat": [ 0, 1, 2, 3, 4, 5, 6 ]
    },function(){});

    db.putSchedule({
        "name": "mondays-17h",
        "start": new Date("2007-11-03T16:00:00"),
        "end":   new Date("2007-11-03T18:00:00"),
        "temp_desired": 23,
        "repeat": [ 1 ] //0 = sunday
    },function(){});

    db.putSchedule({
        "name": "today-22h",
        "start": new Date("2016-11-03T21:00:00"),
        "end":   new Date("2016-11-03T23:00:00"),
        "temp_desired": 23,
        "repeat": [ ]
    },function(){});
}

function performAllTestFrom(from, mocks, checker) {
    it(from + "->OFF: it's cold", function(done) { 
        mocks.current.board.temp = mocks.TEMP(15);
        mocks.current.status.mode = "OFF";
        mocks.current.status.temp_desired = 20;

        checker.execute(false, function() {
            expect(mocks.current.status.status).to.be.equal("OFF");
            expect(mocks.current.board.relay.v()).to.be(false);

            done(); 
        });
    });

    it(from + "->OFF: it's hot", function(done) { 
        mocks.current.board.temp = mocks.TEMP(15);
        mocks.current.status.mode = "OFF";
        mocks.current.status.temp_desired = 10;

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("OFF");
        expect(mocks.current.board.relay.v()).to.be(false);

        done(); 
        });
    });
    
    it(from + "->ON: it's cold", function(done) { 
        mocks.current.board.temp = mocks.TEMP(15);
        mocks.current.status.mode = "ON";
        mocks.current.status.temp_desired = 20;

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("ON");
        expect(mocks.current.board.relay.v()).to.be(true);

        done(); 
        });
    });

    it(from + "->ON: it's hot", function(done) { 
        mocks.current.board.temp = mocks.TEMP(15);
        mocks.current.status.mode = "ON";
        mocks.current.status.temp_desired = 10;

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("OFF");
        expect(mocks.current.board.relay.v()).to.be(false);

        done(); 
        });
    });

    it(from + "->SCHEDULE[today-22h]: it's cold (today & now)", function(done) { 
        mocks.current.board.temp = mocks.TEMP(15);
        mocks.current.status.mode = "SCHEDULE";
        mocks.current.now = function() { return new Date("2016-11-03T22:00:00"); };  

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("ON");
        expect(mocks.current.board.relay.v()).to.be(true);
        expect(mocks.current.status.schedule.name).to.be("today-22h");

        done(); 
        });
    });

    
    it(from + "->SCHEDULE[today-22h]: it's hot (today & now)", function(done) { 
        mocks.current.board.temp = mocks.TEMP(30);
        mocks.current.status.mode = "SCHEDULE";
        mocks.current.now = function() { return new Date("2016-11-03T22:00:00"); };  

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("OFF");
        expect(mocks.current.board.relay.v()).to.be(false);
        expect(mocks.current.status.schedule.name).to.be("today-22h");

        done(); 
        });
    });

    it(from + "->SCHEDULE[today-22h]: it's cold (today & !now)", function(done) { 
        mocks.current.board.temp = mocks.TEMP(10);
        mocks.current.status.mode = "SCHEDULE";
        mocks.current.now = function() { return new Date("2016-11-03T10:00:00"); };  

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("OFF");
        expect(mocks.current.board.relay.v()).to.be(false);
        expect(mocks.current.status.schedule).to.be(null);

        done(); 
        });
    });

    it(from + "->SCHEDULE[today-22h]: it's cold (!today & now)", function(done) { 
        mocks.current.board.temp = mocks.TEMP(10);
        mocks.current.status.mode = "SCHEDULE";
        mocks.current.now = function() { return new Date("2016-12-03T22:00:00"); };  

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("OFF");
        expect(mocks.current.board.relay.v()).to.be(false);
        expect(mocks.current.status.schedule).to.be(null);

        done(); 
        });
    });

    it(from + "->SCHEDULE[null]: it's cold (no matches)", function(done) { 
        mocks.current.board.temp = mocks.TEMP(10);
        mocks.current.status.mode = "SCHEDULE";
        mocks.current.now = function() { return new Date("2016-11-03T10:00:00"); };  //no matches

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("OFF");
        expect(mocks.current.board.relay.v()).to.be(false);
        expect(mocks.current.status.schedule).to.be(null);

        done(); 
        });
    });

    it(from + "->SCHEDULE[everyday-14h]: it's cold (at 14h)", function(done) { 
        mocks.current.board.temp = mocks.TEMP(10);
        mocks.current.status.mode = "SCHEDULE";
        mocks.current.now = function() { return new Date("2001-01-01T14:00:00"); };  //just time matches

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("ON");
        expect(mocks.current.board.relay.v()).to.be(true);
        expect(mocks.current.status.schedule.name).to.be("everyday-14h");

        done(); 
        });
    });

    it(from + "->SCHEDULE[everyday-14h]: it's hot", function(done) { 
        mocks.current.board.temp = mocks.TEMP(30);
        mocks.current.status.mode = "SCHEDULE";
        mocks.current.now = function() { return new Date("2001-01-01T14:00:00"); };  //just time matches

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("OFF");
        expect(mocks.current.board.relay.v()).to.be(false);
        expect(mocks.current.status.schedule.name).to.be("everyday-14h");

        done(); 
        });
    });

    it(from + "->SCHEDULE[mondays-17h]: it's cold (monday at 17h)", function(done) { 
        mocks.current.board.temp = mocks.TEMP(10);
        mocks.current.status.mode = "SCHEDULE";
        mocks.current.now = function() { return new Date("2016-09-19T17:00:00"); };  //it is monday - just time matches

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("ON");
        expect(mocks.current.board.relay.v()).to.be(true);
        expect(mocks.current.status.schedule.name).to.be("mondays-17h");

        done(); 
        });
    });

    it(from + "->SCHEDULE[mondays-17h]: it's cold (tuesday at 17h)", function(done) { 
        mocks.current.board.temp = mocks.TEMP(10);
        mocks.current.status.mode = "SCHEDULE";
        mocks.current.now = function() { return new Date("2016-09-20T17:00:00"); };  //it is tuesday - just time matches

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("OFF");
        expect(mocks.current.board.relay.v()).to.be(false);
        expect(mocks.current.status.schedule).to.be(null);

        done(); 
        });
    });

    it(from + "->SCHEDULE[mondays-17h]: it's hot (monday at 17h)", function(done) { 
        mocks.current.board.temp = mocks.TEMP(30);
        mocks.current.status.mode = "SCHEDULE";
        mocks.current.now = function() { return new Date("2016-09-19T17:00:00"); };  //it is monday - just time matches

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("OFF");
        expect(mocks.current.board.relay.v()).to.be(false);
        expect(mocks.current.status.schedule.name).to.be("mondays-17h");

        done(); 
        });
    });

    it(from + "->SCHEDULE[mondays-17h]: it's hot (tuesday at 17h)", function(done) { 
        mocks.current.board.temp = mocks.TEMP(30);
        mocks.current.status.mode = "SCHEDULE";
        mocks.current.now = function() { return new Date("2016-09-20T17:00:00"); };  //it is tuesday - just time matches

        checker.execute(false, function() {
        expect(mocks.current.status.status).to.be.equal("OFF");
        expect(mocks.current.board.relay.v()).to.be(false);
        expect(mocks.current.status.schedule).to.be(null);

        done(); 
        });
    });
}
