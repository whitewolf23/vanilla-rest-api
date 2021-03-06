'use strict';

const expect = require('chai').expect;
const superagent = require('superagent');
const Note = require('../model/note.js');
const storage = require('../lib/storage.js');
const del = require('del');

require('../servers.js');


const apiURL = `http://localhost:3000/api/notes`;


describe('testing /api/notes', function(){
  before((done) => {
    this.tempNote = new Note({title: 'hello', content: 'world'});
    done();
  });

  after((done) => {
    del([`${__dirname}/../data/notes`])
    .then(() => done())
    .catch(done);
  })


  describe.only('POST with valid input', () => {
    it('POST with valid input and should return a note', (done) => {
      superagent.post(`${apiURL}`)
      .send(this.tempNote)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('hello');
        expect(res.body.content).to.equal('world');
        expect(Boolean(res.body.created)).to.equal(true);
        expect(Boolean(res.body.id)).to.equal(true);
        done();
      })
      .catch(done);
    });
  });

  describe('POST /api/notes with invalid input', () => {
    it('should return a 400 for no invalid input', (done) => {
      superagent.post(`${apiURL}`)
      .send({title: 'hahaha', content: null})
      .then(done)
      .catch((err) => {
        expect(err.status).to.equal(400);
        done();
      });
    });
  });

  describe('GET /api/notes/?id=# with valid input', () => {
    it('should return 200 and a note for good id#', (done) => {

      superagent.get(`${apiURL}?id=${this.tempNote.id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.id).to.equal(this.tempNote.id);
        done();
      })
      .catch((done));
    });
  });

  describe('GET /api/notes?id=# with INVALID input', () => {
    it('should return a 404 for bad id#', (done) => {
      superagent.get(`${apiURL}?id=1234`)
      .then(done)
      .catch((err) => {
        expect(err.status).to.equal(404);
        done();
      });
    });
  });

  describe('GET /api/notes with NO id', () => {
    it('should return a 400 for no ID#', (done) => {
      superagent.get(`${apiURL}`)
      .then(done)
      .catch((err) => {
        expect(err.status).to.equal(400);
        done();
      });
    });
  });

  describe.only('GET /api/notes/ids', () => {
    it('should return an array of IDs', (done) => {
      superagent.get(`${apiURL}/ids`)
      .then((res) => {
        res.body.some((id) =>{
          expect(Boolean(id = this.tempNote.id)).to.equal(true);
        })
        expect(res.body).to.be.instanceof(Array);
        console.log(res.body);
        done();
      })
      .catch((done));
    });
  });

  describe('DELETE /api/notes/?id', () => {
    it('should have status 204 and succesfully delete the item', (done) => {
      superagent.delete(`${apiURL}?id=${this.tempNote.id}`)
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch((done));
    });
  });

  describe('DELETE /api/notes/?id with bad ID', () => {
    it('should have status 404', (done) => {
      superagent.delete(`${apiURL}?id=12345`)
      .then(done)
      .catch((err) => {
      expect(err.status).to.equal(404);
      done();
      });
    });
  });
});

describe.skip('GET /api/notes/ids with no IDs available', function() {
  it('should return a 404 because no IDs available', (done) => {
    superagent.get(`${apiURL}/ids`)
    .then(done)
    .catch((err) => {
      expect(err.status).to.equal(404);
      done();
    });
  });
});
