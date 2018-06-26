"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cube = /** @class */ (function () {
    function Cube(x, y, z) {
        this.v = [];
        this.v = [x, y, z];
    }
    Cube.direction = function (i) {
        return new Cube(Cube.directions[i][0], Cube.directions[i][1], Cube.directions[i][2]);
    };
    Cube.directionByName = function (i) {
        return Cube.direction(Cube._directionName[i]);
    };
    Cube.prototype.moveDirection = function (i) {
        this.v[0] += Cube.directions[i][0];
        this.v[1] += Cube.directions[i][1];
        this.v[2] += Cube.directions[i][2];
        return this;
    };
    Cube.prototype.moveDirectionByName = function (n) {
        var i = Cube._directionName[n];
        this.v[0] += Cube.directions[i][0];
        this.v[1] += Cube.directions[i][1];
        this.v[2] += Cube.directions[i][2];
        return this;
    };
    Cube.prototype.neighbor = function (i) {
        return this.add(Cube.direction(i));
    };
    Cube.makeLine = function (A, B) {
        var d = A.subtract(B);
        var N = 0;
        var _g = 0;
        while (_g < 3) {
            var i = _g++;
            var j = (i + 1) % 3;
            var distance = Math.abs(d.v[i] - d.v[j]) | 0;
            if (distance > N) {
                N = distance;
            }
        }
        var cubes = [];
        var prev = new Cube(0, 0, -999);
        var _g1 = 0, _g = N + 1;
        while (_g1 < _g) {
            var i = _g1++;
            var c = A.add(d.scale(i / N)).round();
            if (!c.equals(prev)) {
                cubes.push(c);
                prev = c;
            }
        }
        return cubes;
    };
    Cube.prototype.toString = function () {
        return this.v.join(",");
    };
    Cube.prototype.equals = function (other) {
        return this.v[0] == other.v[0] && this.v[1] == other.v[1] && this.v[2] == other.v[2];
    };
    Cube.prototype.scale = function (f) {
        return new Cube(f * this.v[0], f * this.v[1], f * this.v[2]);
    };
    Cube.prototype.add = function (other) {
        return new Cube(this.v[0] + other.v[0], this.v[1] + other.v[1], this.v[2] + other.v[2]);
    };
    Cube.prototype.subtract = function (other) {
        return new Cube(this.v[0] - other.v[0], this.v[1] - other.v[1], this.v[2] - other.v[2]);
    };
    Cube.prototype.rotateLeft = function () {
        return new Cube(-this.v[1], -this.v[2], -this.v[0]);
    };
    Cube.prototype.rotateRight = function () {
        return new Cube(-this.v[2], -this.v[0], -this.v[1]);
    };
    Cube.prototype.length = function () {
        var len = 0.0;
        var _g = 0;
        while (_g < 3) {
            var i = _g++;
            if (Math.abs(this.v[i]) > len) {
                len = Math.abs(this.v[i]);
            }
        }
        return len;
    };
    Cube.prototype.round = function () {
        var r = [];
        var sum = 0;
        var _g = 0;
        while (_g < 3) {
            var i = _g++;
            r[i] = Math.round(this.v[i]);
            sum += r[i];
        }
        if (sum != 0) {
            var e = [];
            var worst_i = 0;
            var _g = 0;
            while (_g < 3) {
                var i = _g++;
                e[i] = Math.abs(r[i] - this.v[i]);
                if (e[i] > e[worst_i]) {
                    worst_i = i;
                }
            }
            r[worst_i] = -sum + r[worst_i];
        }
        return new Cube(r[0], r[1], r[2]);
    };
    Cube.directions = [
        [1, -1, 0],
        [1, 0, -1],
        [0, 1, -1],
        [-1, 1, 0],
        [-1, 0, 1],
        [0, -1, 1]
    ];
    Cube._directionName = {
        'left': 3,
        'right': 0,
        'topleft': 2,
        'topright': 1,
        'bottomleft': 4,
        'bottomright': 5
    };
    return Cube;
}());
exports.Cube = Cube;
var Grid = /** @class */ (function () {
    function Grid(scale, orientation, shape) {
        this.scale = scale;
        this.orientation = orientation;
        this.hexes = shape;
    }
    Grid.setHexSize = function (s) {
        Grid.main = s;
        Grid.size = Grid.main / 2;
        Grid.height = Grid.size * 2;
        Grid.width = Grid.SQRT_3 / 2 * Grid.height;
        Grid.verticle = 3 / 4 * Grid.height;
    };
    Grid.pixelToCube = function (x, y) {
        var q = (1 / 3 * Grid.SQRT_3 * x + -1 / 3 * y) / Grid.size;
        var r = 2 / 3 * y / Grid.size;
        return new Cube(q, -q - r, r).round();
    };
    Grid.cubeToPixel = function (cube) {
        return Grid.evenRToPixel(Grid.cubeToEvenR(cube));
    };
    /**
     * even-R > pixel
     *
     * @param hex
     * @returns {Hex}
     */
    Grid.evenRToPixel = function (hex) {
        return new Hex(Grid.size * Grid.SQRT_3 * (hex.q - 0.5 * (hex.r & 1)), Grid.size * 3 / 2 * hex.r);
    };
    Grid.boundsOfPoints = function (points) {
        var minX = 0.0, minY = 0.0, maxX = 0.0, maxY = 0.0;
        var _g = 0;
        while (_g < points.length) {
            var p = points[_g];
            ++_g;
            if (p.x < minX) {
                minX = p.x;
            }
            if (p.x > maxX) {
                maxX = p.x;
            }
            if (p.y < minY) {
                minY = p.y;
            }
            if (p.y > maxY) {
                maxY = p.y;
            }
        }
        return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
    };
    Grid.twoAxisToCube = function (hex) {
        return new Cube(hex.q, -hex.r - hex.q, hex.r);
    };
    Grid.cubeToTwoAxis = function (cube) {
        return new Hex(cube.v[0] | 0, cube.v[2] | 0);
    };
    Grid.oddQToCube = function (hex) {
        var x = hex.q, z = hex.r - (hex.q - (hex.q & 1) >> 1);
        return new Cube(x, -x - z, z);
    };
    Grid.cubeToOddQ = function (cube) {
        var x = cube.v[0] | 0, z = cube.v[2] | 0;
        return new Hex(x, z + (x - (x & 1) >> 1));
    };
    Grid.evenQToCube = function (hex) {
        var x = hex.q, z = hex.r - (hex.q + (hex.q & 1) >> 1);
        return new Cube(x, -x - z, z);
    };
    Grid.cubeToEvenQ = function (cube) {
        var x = cube.v[0] | 0, z = cube.v[2] | 0;
        return new Hex(x, z + (x + (x & 1) >> 1));
    };
    Grid.oddRToCube = function (hex) {
        var z = hex.r, x = hex.q - (hex.r - (hex.r & 1) >> 1);
        return new Cube(x, -x - z, z);
    };
    Grid.cubeToOddR = function (cube) {
        var x = cube.v[0] | 0, z = cube.v[2] | 0;
        return new Hex(x + (z - (z & 1) >> 1), z);
    };
    Grid.evenRToCube = function (hex) {
        var z = hex.r, x = hex.q - (hex.r + (hex.r & 1) >> 1);
        return new Cube(x, -x - z, z);
    };
    Grid.cubeToEvenR = function (cube) {
        var x = cube.v[0] | 0, z = cube.v[2] | 0;
        return new Hex(x + (z + (z & 1) >> 1), z);
    };
    Grid.trapezoidalShape = function (minQ, maxQ, minR, maxR, toCube) {
        var hexes = [];
        var _g1 = minQ, _g = maxQ + 1;
        while (_g1 < _g) {
            var q = _g1++;
            var _g3 = minR, _g2 = maxR + 1;
            while (_g3 < _g2) {
                var r = _g3++;
                hexes.push(toCube(new Hex(q, r)));
            }
        }
        return hexes;
    };
    Grid.triangularShape = function (size) {
        var hexes = [];
        var _g1 = 0, _g = size + 1;
        while (_g1 < _g) {
            var k = _g1++;
            var _g3 = 0, _g2 = k + 1;
            while (_g3 < _g2) {
                var i = _g3++;
                hexes.push(new Cube(i, -k, k - i));
            }
        }
        return hexes;
    };
    Grid.triangularShapeByLength = function (length, toConvert) {
        var hexes = [];
        var _g1 = 0, _g = 200 + 1, count = 0;
        if (typeof (toConvert) == 'undefined') {
            toConvert = false;
        }
        while (_g1 < _g) {
            var k = _g1++;
            var _g3 = 0, _g2 = k + 1;
            while (_g3 < _g2) {
                var i = _g3++;
                if (!toConvert) {
                    hexes.push(new Cube(i, -k, k - i));
                }
                else {
                    hexes.push(toConvert(new Cube(i, -k, k - i)));
                }
                count++;
                if (length < count) {
                    return hexes;
                }
            }
        }
        return hexes;
    };
    Grid.hexagonalShape = function (size) {
        var hexes = [];
        var _g1 = -size, _g = size + 1;
        while (_g1 < _g) {
            var x = _g1++;
            var _g3 = -size, _g2 = size + 1;
            while (_g3 < _g2) {
                var y = _g3++;
                var z = -x - y;
                if (Math.abs(x) <= size && Math.abs(y) <= size && Math.abs(z) <= size) {
                    hexes.push(new Cube(x, y, z));
                }
            }
        }
        return hexes;
    };
    Grid.getRangeFromCube = function (cube, size) {
        return [
            -size + cube.v[0], size + cube.v[0],
            -size + cube.v[1], size + cube.v[1],
            -size + cube.v[2], size + cube.v[2],
        ];
    };
    Grid.hexagonSpiralShape = function (size) {
        var N = size;
        var results = [new Cube(0, 0, 0)];
        for (var k = 0; k <= N; k++) {
            var H = Cube.direction(4).scale(k);
            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < k; j++) {
                    results.push(H);
                    H = H.add(Cube.direction(i));
                }
            }
        }
        return results;
    };
    Grid.getHexagonSpiralShapeByLength = function (total) {
        var N = 1000;
        var results = [new Cube(0, 0, 0)];
        for (var k = 0; k <= N; k++) {
            var H = Cube.direction(4).scale(k);
            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < k; j++) {
                    results.push(H);
                    H = H.add(Cube.direction(i));
                    if (results.length >= total) {
                        return results;
                    }
                }
            }
        }
        return results;
    };
    Grid.getSpiralShapeByLength = function (sides, total) {
        var N = 1000;
        var results = [new Cube(0, 0, 0)];
        for (var k = 0; k <= N; k++) {
            var H = Cube.direction(4).scale(k);
            for (var i = 0; i < sides; i++) {
                for (var j = 0; j < k; j++) {
                    results.push(H);
                    H = H.add(Cube.direction(i));
                    if (results.length >= total) {
                        return results;
                    }
                }
            }
        }
        return results;
    };
    Grid.hexagonRange = function (xmin, xmax, ymin, ymax, zmin, zmax) {
        // Here's the range algorithm as described in the article
        var results = [];
        for (var x = xmin; x <= xmax; x++) {
            for (var y = Math.max(ymin, -x - zmax); y <= Math.min(ymax, -x - zmin); y++) {
                var z = -x - y;
                results.push(new Cube(x, y, z));
            }
        }
        return results;
    };
    Grid.getHexagonRangeLength = function (xmin, xmax, ymin, ymax, zmin, zmax) {
        // Here's the range algorithm as described in the article
        var results = 0;
        for (var x = xmin; x <= xmax; x++) {
            for (var y = Math.max(ymin, -x - zmax); y <= Math.min(ymax, -x - zmin); y++) {
                var z = -x - y;
                results++;
            }
        }
        return results;
    };
    Grid.getIdealIntersectionPositions = function (size0, size1, interSize) {
        if (interSize > size0 || interSize > size1) {
            throw 'intersection size can not be bigger than the two hexagons';
        }
        var cp0 = new Cube(0, 0, 0);
        var cp1 = new Cube(0, 0, 0);
        var c0, c1, total = interSize + 1, offsetCube;
        var tries = 0;
        var maxtries = 100;
        // evenQ
        var offset = new Hex(0, 0);
        c1 = Grid.getRangeFromCube(cp1, size1);
        while (total > interSize) {
            tries++;
            offsetCube = Grid.evenQToCube(offset);
            cp0 = cp0.subtract(offsetCube);
            c0 = Grid.getRangeFromCube(cp0, size0);
            total = Grid.getHexagonIntersectionLength(c0, c1);
            if (total > interSize) {
                offset.q--;
            }
            if (tries > maxtries) {
                throw 'too many tries';
            }
        }
        return [cp0, cp1];
    };
    Grid.calculateByHexagonIntersectionSize2 = function (size0, size1, intersectionSize) {
        if (intersectionSize > size0 || intersectionSize > size1) {
            throw 'intersection size can not be bigger than the two hexagons';
        }
        var cp0 = Grid.getHexagonSpiralShapeByLength(size0);
        var cp1 = Grid.getHexagonSpiralShapeByLength(size1);
        var cp2 = [];
        var offset = Grid.evenRToCube(new Hex(-1, 0));
        var cp0center = new Cube(0, 0, 0);
        var cp1center = new Cube(0, 0, 0);
        var cp2center = new Cube(0, 0, 0);
        cp0.length = Math.min(size0, cp0.length);
        cp1.length = Math.min(size1, cp1.length);
        cp2.length = Math.min(intersectionSize, cp2.length);
        var cp3, c0, c1, count = cp0.length, offsetCube;
        var tries = 0;
        var maxtries = 300;
        // calculating best intersection point.
        while (count > intersectionSize) {
            count = cp2.length = 0;
            tries++;
            if ((tries & 1) == 0) {
                for (var a = 0; a < cp0.length; ++a) {
                    cp0[a] = c0 = cp0[a].subtract(offset);
                    for (var b = 0; b < cp1.length; ++b) {
                        c1 = cp1[b];
                        if (c0.equals(c1)) {
                            count++;
                            cp2.push(c0);
                        }
                    }
                }
            }
            else {
                for (var a = 0; a < cp1.length; ++a) {
                    cp1[a] = cp1[a].add(offset);
                    for (var b = 0; b < cp0.length; ++b) {
                        if (cp0[b].equals(cp1[a])) {
                            count++;
                            cp2.push(cp1[a]);
                        }
                    }
                }
            }
            if (tries > maxtries) {
                throw 'too many tries';
            }
        }
        // remove intersection items
        for (var a = 0; a < cp2.length; ++a) {
            for (var b = 0; b < cp0.length; ++b) {
                if (cp0[b].equals(cp2[a])) {
                    cp0.splice(b, 1);
                }
            }
            for (var c = 0; c < cp1.length; ++c) {
                if (cp1[c].equals(cp2[a])) {
                    cp1.splice(c, 1);
                }
            }
        }
        // calculating center points
        var items = [cp0, cp1, cp2];
        var center = [cp0center, cp1center, cp2center];
        for (var a = 0; a < items.length; ++a) {
            for (var i = 0; i < items[a].length; ++i) {
                center[a].v[0] += items[a][i].v[0];
                center[a].v[1] += items[a][i].v[1];
                center[a].v[2] += items[a][i].v[2];
            }
            center[a].v[0] = center[a].v[0] / items[a].length;
            center[a].v[1] = center[a].v[1] / items[a].length;
            center[a].v[2] = center[a].v[2] / items[a].length;
            center[a].round();
        }
        return {
            center0: center[0],
            center1: center[1],
            center2: center[2],
            list0: cp0,
            list1: cp1,
            list2: cp2
        };
    };
    Grid.hexagonIntersection = function (point0, point1) {
        return Grid.hexagonRange(Math.max(point0[0], point1[0]), Math.min(point0[1], point1[1]), Math.max(point0[2], point1[2]), Math.min(point0[3], point1[3]), Math.max(point0[4], point1[4]), Math.min(point0[5], point1[5]));
    };
    Grid.getHexagonIntersectionLength = function (point0, point1) {
        return Grid.getHexagonRangeLength(Math.max(point0[0], point1[0]), Math.min(point0[1], point1[1]), Math.max(point0[2], point1[2]), Math.min(point0[3], point1[3]), Math.max(point0[4], point1[4]), Math.min(point0[5], point1[5]));
    };
    Grid.prototype.hexToCenter = function (cube) {
        if (this.orientation) {
            return new ScreenCoordinate(this.scale * (Grid.SQRT_3_2 * (cube.v[0] + 0.5 * cube.v[2])), this.scale * (0.75 * cube.v[2]));
        }
        else {
            return new ScreenCoordinate(this.scale * (0.75 * cube.v[0]), this.scale * (Grid.SQRT_3_2 * (cube.v[2] + 0.5 * cube.v[0])));
        }
    };
    Grid.prototype.bounds = function () {
        var me = this;
        var centers = Lambda.array(Lambda.map(this.hexes, function (hex) {
            return me.hexToCenter(hex);
        }));
        var b1 = Grid.boundsOfPoints(this.polygonVertices());
        var b2 = Grid.boundsOfPoints(centers);
        return { minX: b1.minX + b2.minX, maxX: b1.maxX + b2.maxX, minY: b1.minY + b2.minY, maxY: b1.maxY + b2.maxY };
    };
    Grid.prototype.polygonVertices = function () {
        var points = [];
        var _g = 0;
        while (_g < 6) {
            var i = _g++;
            var angle = 2 * Math.PI * (2 * i - (this.orientation ? 1 : 0)) / 12;
            points.push(new ScreenCoordinate(0.5 * this.scale * Math.cos(angle), 0.5 * this.scale * Math.sin(angle)));
        }
        return points;
    };
    Grid.SQRT_3 = Math.sqrt(3);
    Grid.SQRT_3_2 = Grid.SQRT_3 / 2;
    Grid.main = 45;
    Grid.size = Grid.main / 2;
    Grid.height = Grid.size * 2;
    Grid.width = Grid.SQRT_3 / 2 * Grid.height;
    Grid.verticle = 3 / 4 * Grid.height;
    return Grid;
}());
exports.Grid = Grid;
var Hex = /** @class */ (function () {
    function Hex(q, r) {
        this.q = q;
        this.r = r;
    }
    Hex.prototype.toString = function () {
        return this.q + ":" + this.r;
    };
    return Hex;
}());
exports.Hex = Hex;
var ScreenCoordinate = /** @class */ (function () {
    function ScreenCoordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    ScreenCoordinate.prototype.equals = function (p) {
        return this.x == p.x && this.y == p.y;
    };
    ScreenCoordinate.prototype.toString = function () {
        return this.x + "," + this.y;
    };
    ScreenCoordinate.prototype.length_squared = function () {
        return this.x * this.x + this.y * this.y;
    };
    ScreenCoordinate.prototype.length = function () {
        return Math.sqrt(this.length_squared());
    };
    ScreenCoordinate.prototype.normalize = function () {
        var d = this.length();
        return new ScreenCoordinate(this.x / d, this.y / d);
    };
    ScreenCoordinate.prototype.scale = function (d) {
        return new ScreenCoordinate(this.x * d, this.y * d);
    };
    ScreenCoordinate.prototype.rotateLeft = function () {
        return new ScreenCoordinate(this.y, -this.x);
    };
    ScreenCoordinate.prototype.rotateRight = function () {
        return new ScreenCoordinate(-this.y, this.x);
    };
    ScreenCoordinate.prototype.add = function (p) {
        return new ScreenCoordinate(this.x + p.x, this.y + p.y);
    };
    ScreenCoordinate.prototype.subtract = function (p) {
        return new ScreenCoordinate(this.x - p.x, this.y - p.y);
    };
    ScreenCoordinate.prototype.dot = function (p) {
        return this.x * p.x + this.y * p.y;
    };
    ScreenCoordinate.prototype.cross = function (p) {
        return this.x * p.y - this.y * p.x;
    };
    ScreenCoordinate.prototype.distance = function (p) {
        return this.subtract(p).length();
    };
    return ScreenCoordinate;
}());
exports.ScreenCoordinate = ScreenCoordinate;
var Lambda = /** @class */ (function () {
    function Lambda() {
    }
    Lambda.array = function (it) {
        var a = new Array();
        //		var $it0 = $iterator( it )();
        //		while( $it0.hasNext() ){
        //			var i = $it0.next();
        //			a.push( i );
        //		}
        return a;
    };
    Lambda.map = function (it, f) {
        var l = new List();
        //		var $it0 = $iterator( it )();
        //		while( $it0.hasNext() ){
        //			var x = $it0.next();
        //			l.add( f( x ) );
        //		}
        return l;
    };
    return Lambda;
}());
var List = /** @class */ (function () {
    function List() {
        this.length = 0;
    }
    List.prototype.add = function (item) {
        var x = [item];
        if (this.h == null) {
            this.h = x;
        }
        else {
            this.q[1] = x;
        }
        this.q = x;
        this.length++;
    };
    List.prototype.iterator = function () {
        return {
            h: this.h, hasNext: function () {
                return this.h != null;
            }, next: function () {
                if (this.h == null) {
                    return null;
                }
                var x = this.h[0];
                this.h = this.h[1];
                return x;
            }
        };
    };
    return List;
}());
