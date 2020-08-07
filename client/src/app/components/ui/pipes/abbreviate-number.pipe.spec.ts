import * as sinon from 'sinon';

import { expect } from 'chai';

import { AbbreviateNumberPipe } from './abbreviate-number.pipe';

describe('Pipe: abbreviateNumber', () => {
	const sandbox = sinon.createSandbox();

	let pipe: AbbreviateNumberPipe;

	beforeEach((() => {
		pipe = new AbbreviateNumberPipe();
	}));

	afterEach(() => {
		sandbox.restore();
	});

	it('should return zero / value is negative', () => {
		expect(pipe.transform(-2)).to.be.equal('-2');
	});

	it('should return zero / value is wrong', () => {
		const a: any = 'dsd';
		expect(pipe.transform(a)).to.be.equal('0');
	});

	it('should return zero / value doesn\'t exist', () => {
		expect(pipe.transform(null)).to.be.equal('0');
	});

	it('should return zero / value is zero', () => {
		expect(pipe.transform(0)).to.be.equal('0');
	});

	it('should return value without ABBRS / value less 10,000', () => {
		expect(pipe.transform(239)).to.be.equal(239);
	});

	it('should return value with ABBRS / value less 10,000', () => {
		expect(pipe.transform(2392)).to.be.equal('2.4K');
	});

	it('should return float number with ABBRS K / value between 10^3 and 999,999', () => {
		expect(pipe.transform(18577)).to.be.equal('18.6K');
	});

	it('should return float number with ABBRS K / value between 10^3 and 999,999', () => {
		expect(pipe.transform(100000)).to.be.equal('100K');
	});

	it('should return float number with ABBRS M / value between 10^3 and 999,999', () => {
		expect(pipe.transform(999999)).to.be.equal('1M'); // 999,999
	});

	it('should return rounded value with ABBRS M / value between 10^6 and 999,999,999', () => {
		expect(pipe.transform(9894562)).to.be.equal('9.9M'); // 9,894,562
	});

	it('should return rounded value with ABBRS M / value between 10^6 and 999,999,999', () => {
		expect(pipe.transform(99894562)).to.be.equal('99.9M'); // 99,894,562
	});

	it('should return rounded value with ABBRS M / value between 10^6 and 999,999,999', () => {
		expect(pipe.transform(998894562)).to.be.equal('999M'); // 998,894,562
	});

	it('should return rounded value with ABBRS G / value between 10^6 and 999,999,999', () => {
		expect(pipe.transform(999894562)).to.be.equal('1G'); // 999,894,562
	});

	it('should return rounded value with ABBRS G / value between 10^9 and 999,999,999,999', () => {
		expect(pipe.transform(99887894562)).to.be.equal('99.9G'); // 99,887,894,562
	});

	it('should return rounded value with ABBRS G / value between 10^9 and 999,999,999,999', () => {
		expect(pipe.transform(998878945625)).to.be.equal('999G'); // 998,878,945,625
	});

	it('should return rounded value with ABBRS T / value between 10^9 and 999,999,999,999', () => {
		expect(pipe.transform(999878945625)).to.be.equal('1T'); // 999,878,945,625
	});

	it('should return rounded value with ABBRS T / value between 10^12 and 999,999,999,999,999', () => {
		expect(pipe.transform(998878945625234)).to.be.equal('999T'); // 998,878,945,625,234
	});

	it('should return rounded value with ABBRS P / value between 10^12 and 999,999,999,999,999', () => {
		expect(pipe.transform(999878945625234)).to.be.equal('1P'); // 999,878,945,625,234
	});

	it('should return rounded value with ABBRS P / value between 10^15 and 999,999,999,999,999,999', () => {
		expect(pipe.transform(998878945625555556)).to.be.equal('999P'); // 998,878,945,625,555,556
	});

	it('should return 1 / javascript doesn\'t support value more than 10^15', () => {
		expect(pipe.transform(999878945625555556)).to.be.equal(1); // 999,878,945,625,555,556
	});
});