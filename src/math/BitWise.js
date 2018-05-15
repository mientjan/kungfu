/*
 *
 * Copyright (c) 2015 Mient-jan Stelling.
 * Copyright (c) 2015 MediaMonks N.V.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * BitWise
 *
 * create a enum
 *
 * const PizzaIngredients {
 *  BREAD: 1 << 0,
 *  CHEESE: 1 << 1,
 *  TOMATO: 1 << 2,
 *  UNIONS: 1 << 3,
 *  GARLIC: 1 << 4,
 * }
 *
 * var PizzaMozzarella = PizzaIngredients.BREAD | PizzaIngredients.TOMATO | PizzaIngredients.CHEESE;
 * var GarlicBread = PizzaIngredients.BREAD | PizzaIngredients.GARLIC;
 *
 * var pizza = new Flag<PizzaIngredients>();
 * pizza.add( PizzaIngredients.BREAD | PizzaIngredients.TOMATO | PizzaIngredients.CHEESE );
 *
 * pizza.equals(PizzaMozzarella); // true
 * pizza.contains(GarlicBread); // true
 * pizza.add(GarlicBread); // true
 * pizza.equals(PizzaMozzarella); // false because not contains garlic
 *
 * @class BitWise
 * @author Mient-jan Stelling <mient-jan@mediamonks.com>
 */
/* eslint-disable */
class BitWise {
	static pos(value) {
		return BitWise.shiftLeft(1, value);
	}

	static shiftLeft(value, shift) {
		return value << shift;
	}

	static shiftRight(value, shift) {
		return value >> shift;
	}

	/**
	 * (2 | 4) & 2 // 2
	 * (2 | 4) & 1 // 0
	 *
	 * @method contains
	 * @param value
	 * @returns {boolean}
	 */
	static contains(current, value) {
		// eslint
		return !!(current & value);
	}

	/**
	 * FLAG_A | FLAG_B | FLAG_D; // 0001 | 0010 | 1000 => 1011
	 *
	 * @param args Array<number>
	 * @return {*}
	 */
	static add(...args) {
		let result = 0;
		for (let i = 0; i < args.length; i++) {
			result |= args[i];
		}

		return result;
	}

	static set = BitWise.add;

	/**
	 * @method remove
	 * @param value
	 * @returns {boolean}
	 */
	static remove(current, value) {
		current = (current ^ value) & current;

		return current;
	}

	/**
	 * Compares the value of the Flag with the given value
	 *
	 * @method equals
	 * @param value
	 * @returns {boolean}
	 */
	static equals(current, value) {
		return current === value;
	}

	/**
	 * Returns a new Flag with the diff between the two flags
	 *
	 * Flags without
	 *
	 * @method intersection
	 * @param value
	 * @returns {boolean}
	 */
	static diff(current, value) {
		return current ^ value;
	}

	/**
	 * Returns a new Flag with the intersection between the two flags
	 *
	 * @method intersection
	 * @param value
	 * @returns {boolean}
	 */
	static intersection(current, value) {
		return current & value;
	}

	/**
	 *
	 * @param value
	 * @return {string}
	 */
	static toString(value) {
		return value.toString(2);
	}

	/**
	 *
	 * @param value
	 * @return {number}
	 */
	static toInt(value) {
		return parseInt(value, 2);
	}

	/**
	 *
	 * @param {Array<boolean>} args
	 */
	static createMask(...args) {
		let mask = 0;
		const length = Math.min(arguments.length, 32);

		for (let flag = 0; i < length; flag++) {
			mask |= args[flag] << flag;
		}

		return mask;
	}

	static maskToArray(mask) {
		if (mask > 0x7fffffff || mask < -0x80000000) {
			throw new TypeError('arrayFromMask - out of range');
		}
		const result = [];
		for (
			let shifted = mask, aFromMask = [];
			shifted;
			aFromMask.push(Boolean(shifted & 1)), shifted >>>= 1
		);
		return aFromMask;
	}
}

export default BitWise;
