/*
* Jssor.Point 3.0
* 
* TERMS OF USE - Jssor.Point
* 
* Open source under the BSD License. 
* 
* Copyright Â© 2012 Jssor
* All rights reserved.
* 
* Redistribution and use in source and binary forms, with or without modification, 
* are permitted provided that the following conditions are met:
* 
* Redistributions of source code must retain the above copyright notice, this list of 
* conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list 
* of conditions and the following disclaimer in the documentation and/or other materials 
* provided with the distribution.
* 
* Neither the name of the author nor the names of contributors may be used to endorse 
* or promote products derived from this software without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
*  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
*  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
*  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
*  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
* OF THE POSSIBILITY OF SUCH DAMAGE. 
*
*/

var $JssorPoint$;

(function() {

    $JssorPoint$ = function(x, y) {
        
        // Properties
        
        this.x = typeof(x) == "number" ? x : 0;
        this.y = typeof(y) == "number" ? y : 0;
        
    };

    // Methods
    
    var SDPointPrototype = $JssorPoint$.prototype;

    SDPointPrototype.$Plus = function(point) {
        return new $JssorPoint$(this.x + point.x, this.y + point.y);
    };

    SDPointPrototype.$Minus = function(point) {
        return new $JssorPoint$(this.x - point.x, this.y - point.y);
    };

    SDPointPrototype.$Times = function(factor) {
        return new $JssorPoint$(this.x * factor, this.y * factor);
    };

    SDPointPrototype.$Divide = function(factor) {
        return new $JssorPoint$(this.x / factor, this.y / factor);
    };

    SDPointPrototype.$Negate = function() {
        return new $JssorPoint$(-this.x, -this.y);
    };

    SDPointPrototype.$DistanceTo = function(point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) +
                        Math.pow(this.y - point.y, 2));
    };

    SDPointPrototype.$Apply = function(func) {
        return new $JssorPoint$(func(this.x), func(this.y));
    };

    SDPointPrototype.$Equals = function(point) {
        return (point instanceof $JssorPoint$) &&
                (this.x === point.x) && (this.y === point.y);
    };

    SDPointPrototype.$ToString = function() {
        return "(" + this.x + "," + this.y + ")";
    };

})();
