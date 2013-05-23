/// <reference path="Jssor.Core.js" />
/// <reference path="Jssor.Debug.js" />
/// <reference path="Jssor.EventManager.js />
/// <reference path="Jssor.Utils.js" />

/*
* Jssor.Navigator 6.0
* 
* TERMS OF USE - Jssor.Navigator
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

var $JssorNavigatorEvents$ = {
    $NAVIGATIONREQUEST: 1,
    $INDEXCHANGE: 2,
    $RESET: 3
};

function $JssorNavigator$(elmt, options) {
    var self = this;
    $JssorEventManager$.call(self);

    elmt = $JssorUtils$.$GetElement(elmt);

    var _Count;
    var _Length;
    var _Width;
    var _Height;
    var _CurrentIndex;
    var _CurrentInnerIndex = 0;
    var _Options;
    var _Steps;
    var _Lanes;
    var _SpacingX;
    var _SpacingY;
    var _Orientation;
    var _ItemPrototype;
    var _PrototypeWidth;
    var _PrototypeHeight;

    var _ButtonElements = [];
    var _Buttons = [];

    function Highlight(index) {
        if (index != -1)
            _Buttons[index].$Activate(index == _CurrentInnerIndex);
    }

    function OnNavigationRequest(index) {
        self.$TriggerEvent($JssorNavigatorEvents$.$NAVIGATIONREQUEST, index * _Steps);
    }

    self.$Elmt = elmt;
    self.$GetCurrentIndex = function () {
        return _CurrentIndex;
    };

    self.$SetCurrentIndex = function (index) {
        if (index != _CurrentIndex) {
            var lastInnerIndex = _CurrentInnerIndex;
            var innerIndex = Math.floor(index / _Steps);
            _CurrentInnerIndex = innerIndex;
            _CurrentIndex = index;

            Highlight(lastInnerIndex);
            Highlight(innerIndex);

            self.$TriggerEvent($JssorNavigatorEvents$.$INDEXCHANGE, index);
        }
    };

    self.$Show = function (show) {
        $JssorUtils$.$ShowElement(elmt, show);
    };

    var _Initialized;
    self.$Reset = function (length) {
        if (!_Initialized) {
            _Length = length;
            _Count = Math.ceil(length / _Steps);
            _CurrentInnerIndex = 0;

            var itemOffsetX = _PrototypeWidth + _SpacingX;
            var itemOffsetY = _PrototypeHeight + _SpacingY;

            var maxIndex = Math.ceil(_Count / _Lanes) - 1;

            _Width = _PrototypeWidth + itemOffsetX * (!_Orientation ? maxIndex : _Lanes - 1);
            _Height = _PrototypeHeight + itemOffsetY * (_Orientation ? maxIndex : _Lanes - 1);

            //$JssorUtils$.$SetInnerHtml(elmt, "");
            $JssorUtils$.$SetStyleWidth(elmt, _Width);
            $JssorUtils$.$SetStyleHeight(elmt, _Height);

            for (var buttonIndex = 0; buttonIndex < _Count; buttonIndex++) {

                var numberDiv = $JssorUtils$.$CreateSpanElement();
                $JssorUtils$.$SetInnerText(numberDiv, buttonIndex + 1);

                var div = $JssorUtils$.$BuildElement(_ItemPrototype, "NumberTemplate", numberDiv, true);
                $JssorUtils$.$SetStylePosition(div, "absolute");

                var columnIndex = Math.floor(buttonIndex / _Lanes);
                $JssorUtils$.$SetStyleLeft(div, !_Orientation ? itemOffsetX * columnIndex : buttonIndex % _Lanes * itemOffsetX);
                $JssorUtils$.$SetStyleTop(div, _Orientation ? itemOffsetY * columnIndex : buttonIndex % _Lanes * itemOffsetY);

                $JssorUtils$.$AppendChild(elmt, div);
                _ButtonElements[buttonIndex] = div;

                $JssorUtils$.$AddEvent(div, "click", $JssorUtils$.$CreateCallback(null, OnNavigationRequest, buttonIndex));
                _Buttons[buttonIndex] = $JssorUtils$.$Buttonize(div, true);
            }

            self.$TriggerEvent($JssorNavigatorEvents$.$RESET);
            _Initialized = true;
        }
    };

    //JssorNavigator Constructor
    {
        self.$Options = _Options = $JssorUtils$.$Extend({
            $SpacingX: 0,
            $SpacingY: 0,
            $Orientation: 1
        }, options);

        //Sodo statement for development time intelligence only
        $JssorDebug$.$Execute(function () {
            _Options = $JssorUtils$.$Extend({
                $Steps: undefined,
                $Lanes: undefined
            }, _Options);
        });

        _ItemPrototype = $JssorUtils$.$FindFirstChildByAttribute(elmt, "prototype");

        $JssorDebug$.$Execute(function () {
            if (!_ItemPrototype)
                $JssorDebug$.$Fail("Navigator item prototype not defined.");

            if (isNaN($JssorUtils$.$GetStyleWidth(_ItemPrototype))) {
                $JssorDebug$.$Fail("Width of 'navigator item prototype' not specified.");
            }

            if (isNaN($JssorUtils$.$GetStyleHeight(_ItemPrototype))) {
                $JssorDebug$.$Fail("Height of 'navigator item prototype' not specified.");
            }
        });

        _PrototypeWidth = $JssorUtils$.$GetStyleWidth(_ItemPrototype);
        _PrototypeHeight = $JssorUtils$.$GetStyleHeight(_ItemPrototype);

        $JssorUtils$.$RemoveChild(elmt, _ItemPrototype);

        _Steps = _Options.$Steps || 1;
        _Lanes = _Options.$Lanes || 1;
        _SpacingX = _Options.$SpacingX;
        _SpacingY = _Options.$SpacingY;
        _Orientation = _Options.$Orientation - 1;
    }
}

function $JssorDirectionNavigator$(elmt, options) {
    var self = this;
    $JssorEventManager$.call(self);

    var arrowLeft = $JssorUtils$.$FindFirstChildByAttribute(elmt, "arrowleft", null, true);
    var arrowRight = $JssorUtils$.$FindFirstChildByAttribute(elmt, "arrowright", null, true);
    var _Length;
    var _CurrentIndex;
    var _Options;
    var _Steps;

    $JssorDebug$.$Execute(function () {
        if (!arrowLeft)
            $JssorDebug$.$Fail("Option '$DirectionNavigatorOptions' spepcified, but UI 'arrowleft' not defined. Define 'arrowleft' to enable direct navigation, or remove option '$DirectionNavigatorOptions' to disable direct navigation.");

        if (!arrowLeft)
            $JssorDebug$.$Fail("Option '$DirectionNavigatorOptions' spepcified, but UI 'arrowright' not defined. Define 'arrowright' to enable direct navigation, or remove option '$DirectionNavigatorOptions' to disable direct navigation.");
    });

    function OnNavigationRequest(index) {
        self.$TriggerEvent($JssorNavigatorEvents$.$NAVIGATIONREQUEST, index);
    }

    self.$GetCurrentIndex = function () {
        return _CurrentIndex;
    };

    self.$SetCurrentIndex = function (index) {
        _CurrentIndex = index;
        self.$TriggerEvent($JssorNavigatorEvents$.$INDEXCHANGE, index);
    };

    self.$Show = function (show) {
        $JssorUtils$.$ShowElement(arrowLeft, show);
        $JssorUtils$.$ShowElement(arrowRight, show);
    };

    var _Initialized;
    self.$Reset = function (length) {
        _Length = length;
        _CurrentIndex = 0;

        if (!_Initialized) {
            $JssorUtils$.$AddEvent(arrowLeft, "click", function () { OnNavigationRequest(_CurrentIndex - _Steps); });
            $JssorUtils$.$AddEvent(arrowRight, "click", function () { OnNavigationRequest(_CurrentIndex + _Steps); });

            $JssorUtils$.$Buttonize(arrowLeft, true);
            $JssorUtils$.$Buttonize(arrowRight, true);
        }

        self.$TriggerEvent($JssorNavigatorEvents$.$RESET);
    };

    //JssorDirectionNavigator Constructor
    {
        self.$Options = _Options = $JssorUtils$.$Extend({
            $Steps: 1
        }, options);

        _Steps = _Options.$Steps;
    }
}