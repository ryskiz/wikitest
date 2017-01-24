var expect = require('chai').expect;
var chai = require('chai');
var spies = require('chai-spies');
var models = require('../models');
var sequelize = require('sequelize');
var Page = models.Page;
//cmd + option + L
chai.use(spies);
chai.should();
chai.use(require('chai-things'));

describe('Page model', function () {
    beforeEach(function () {
        return Page.sync({force: true});
    });
    describe('Virtuals', function () {
        var page;
        beforeEach(function () {
            page = Page.build();
        });
        describe('route', function () {
            it('returns the url_name prepended by "/wiki/"', function () {
                page.title = "this is a new title 2";
                page.urlTitle = "some_title";
                expect(page.route).to.equal("/wiki/some_title");
            });
        });
        describe('renderedContent', function () {
            it('converts the markdown-formatted content into HTML', function () {
                page.content = "This is some content";
                expect(page.renderedContent).to.equal("<p>This is some content</p>\n");
            });
        });
    });

    describe('Class methods', function () {
        beforeEach(function (done) {
            Page.sync({force: true})
                .then(() => {
                    Page.create({
                        title: "this is a title",
                        content: "content body",
                        tags: ["javascript", "other"]
                    })
                })
                .then(() => {
                    done();
                })
                .catch(done);
        });
        describe('findByTag', function () {
            it('gets pages with the search tag', function (done) {
                Page.findByTag("javascript")
                    .then((data) => {
                        expect(data.length).to.equal(1);
                        done();
                    });
            });
            it('does not get pages without the search tag', function (done) {
                Page.create({
                    title: "this is another title",
                    content: "content body of other title",
                    tags: ["something"]
                })
                    .then(() => {
                        Page.findByTag("blah")
                            .then((data) => {
                                expect(data.length).to.equal(0);
                            })
                            .then(() => {
                                Page.findByTag("javascript")
                                    .then((data) => {
                                        expect(data.length).to.equal(1);
                                        done();
                                    })
                            })
                            .catch(done);
                    })
            });
        });
    });

    describe('Instance methods', function () {
        var page1, page2, page3;
        beforeEach(function () {
            return Promise.all([
                Page.create({
                    title: "this is a title",
                    content: "content body",
                    tags: ["javascript", "other"]
                }),
                Page.create({
                    title: "this is another title",
                    content: "some other content body",
                    tags: ["javascript", "otherTitle", "something"]
                }),
                Page.create({
                    title: "I am a kewl title",
                    content: "kewlness",
                    tags: ["super kewl"]
                })
            ])
                .then((pages) => {

                    page1 = pages[0];
                    page2 = pages[1];
                    page3 = pages[2];
                });
        });

        it('never gets itself', function (done) {
            page1.findSimilar()
                .then((data) => {
                    expect(data[0].id).to.equal(2);
                    done();
                });
        });
        it('gets other pages with any common tags', function () {

        });
        it('does not get other pages without any common tags');
    });

    describe('Validations', function () {
        var page;
        beforeEach(function () {
            page = Page.build();
        });

        it('errors without title', function (done) {

            page.validate()
                .then((err) => {
                    expect(err).to.exist;
                    expect(err.errors).to.exist;
                    expect(err.errors[0].path).to.equal('title');
                    done()
                });
        });
        it('errors without content');
        it('errors given an invalid status');
    });
    describe('Hooks', function () {
        var page;
        beforeEach(function () {
            page = Page.build();
        });
        it('it sets urlTitle based on title before validating', function (done) {
            page.title = "THIS IS A TITLE YO";
            page.content = "THIS IS CONTENT";
            page.save()
                .then((data) => {
                    expect(page.urlTitle).to.equal("THIS_IS_A_TITLE_YO");
                    done();
                });

        });
    });

});