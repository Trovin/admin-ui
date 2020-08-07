import * as sinon from 'sinon';

import { expect } from 'chai';

import { TimeFormatPipe } from './time-format.pipe';

describe('Pipe: timeFormatPipe', () => {
	const sandbox = sinon.createSandbox();
	const testUnit = 'MICROSECOND';
	let pipe: TimeFormatPipe;

	beforeEach((() => {
		pipe = new TimeFormatPipe();
	}));

	afterEach(() => {
		sandbox.restore();
	});

	it('should return "-" / value is negative', () => {
		expect(pipe.transform(-255, testUnit)).to.be.equal('-');
	});

	it('should return "-" / value is wrong', () => {
		const a: any = 'dsd';
		expect(pipe.transform(a, testUnit)).to.be.equal('-');
	});

	it('should return "-" / value doesn\'t exist', () => {
		expect(pipe.transform(null, testUnit)).to.be.equal('-');
	});

	it('should return "-" / value is zero', () => {
		expect(pipe.transform(0, testUnit)).to.be.equal('-');
	});

	it('should return value with ABBR "d" / value has days', () => {
		expect(pipe.transform(555555555555, testUnit)).to.be.equal('6d 10h 19m 15s ');
	});

	it('should return value without ABBR "d" / value less 1 day', () => {
		expect(pipe.transform(55555555555, testUnit)).to.be.equal('15h 25m 55s ');
	});

	it('should return value without ABBR "h" / value less 1 hour', () => {
		expect(pipe.transform(555555555, testUnit)).to.be.equal('9m 15s ');
	});

	it('should return value without ABBR "m" / value less 1 minute', () => {
		expect(pipe.transform(55555555, testUnit)).to.be.equal('55s ');
	});

	it('should return value without ABBR "s" / value less 1 sec', () => {
		expect(pipe.transform(555555, testUnit)).to.be.equal('-');
	});
});
