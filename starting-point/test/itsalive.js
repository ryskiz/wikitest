var expect = require('chai').expect;
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

describe('Testing suit capabilities', function(){
    it('confirms basic arithmetic', function(){
        expect(2+2).to.equal(4);
    })
});
// describe('setTimeout check', function(){
//     it('confirms that setTimeout is exactly 1000 milliseconds', function(done){
//
//         var start = new Date();
//         setTimeout(function () {
//             var duration = new Date() - start;
//             expect(duration).to.be.closeTo(1000, 50);
//             done();
//         }, 1000);
//     })
// });
describe('forEach count,', function(){
    it('counts the amount of times the callback was called', function(){
        function fn(i){
            console.log(i)
        };
        var arr = [1,2,3,4,5];

        fn = chai.spy(fn);
        arr.forEach(fn);

        expect(fn).to.have.been.called.exactly(5);
    })
});