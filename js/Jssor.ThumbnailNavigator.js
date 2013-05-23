/// <reference path="Jssor.Core.js" />
/// <reference path="Jssor.Debug.js" />
/// <reference path="Jssor.EventManager.js />
/// <reference path="Jssor.Point.js" />
/// <reference path="Jssor.Utils.js" />
/// <reference path="Jssor.Easing.js" />
/// <reference path="Jssor.Navigator.js" />
/// <reference path="Jssor.Slider.js" />

/*
* Jssor.ThumbnailNavigator 6.0
* 
* TERMS OF USE - Jssor.ThumbnailNavigator
* 
* Open source under the BSD License. 
* 
* Copyright Â© 2013 Jssor
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

function $JssorThumbnailNavigator$(elmt, options) {
    var _Self = this;
    var _Length;
    var _CurrentIndex;
    var _Options;
    var _NavigationItems = [];

    var _IsIeQuirks;
    var _Width;
    var _Height;
    var _Lanes;
    var _SpacingX;
    var _SpacingY;
    var _PrototypeWidth;
    var _PrototypeHeight;
    var _DisplayPieces;
    var _DirectionNavigatorOptions;
    var _ParkingPosition;

    var _Slideshow;
    var _CurrentMouseOverIndex = -1;

    var _SlidesContainer;
    var _ThumbnailPrototype;

    $JssorEventManager$.call(_Self);
    elmt = $JssorUtils$.$GetElement(elmt);

    function NavigationItem(item, index) {
        var self = this;
        var _Wrapper;
        var _Button;
        var _Thumbnail;

        function Highlight(mouseStatus) {
            _Button.$Activate(_CurrentIndex == index);
        }

        function OnNavigationRequest() {
            if (!_Slideshow.$IsLastDragSucceded())
                _Self.$TriggerEvent($JssorNavigatorEvents$.$NAVIGATIONREQUEST, index);
        }

        $JssorDebug$.$Execute(function () {
            self.$Wrapper = undefined;
        });

        self.$Index = index;

        self.$Highlight = Highlight;

        //NavigationItem Constructor
        {
            _Thumbnail = item.$Thumb || item.$Image || $JssorUtils$.$CreateDivElement();
            self.$Wrapper = _Wrapper = $JssorUtils$.$BuildElement(_ThumbnailPrototype, "ThumbnailTemplate", _Thumbnail, true);

            _Button = $JssorUtils$.$Buttonize(_Wrapper, true);
            $JssorUtils$.$AddEvent(_Wrapper, "click", OnNavigationRequest);
        }
    }

    _Self.$GetCurrentIndex = function () {
        return _CurrentIndex;
    };

    _Self.$SetCurrentIndex = function (index, temp) {
        var oldIndex = _CurrentIndex;
        _CurrentIndex = index;
        if (oldIndex != -1)
            _NavigationItems[oldIndex].$Highlight();
        _NavigationItems[index].$Highlight();
        if (!temp && _Slideshow.$Request()) {
            //_Slideshow.$PlayCarouselIntoView(Math.floor(index / _Lanes), 200);
            _Slideshow.$GoTo(Math.floor(index / _Lanes));
            _Slideshow.$Unrequest();
        }
        _Self.$TriggerEvent($JssorNavigatorEvents$.$INDEXCHANGE, index);
    };

    _Self.$Show = function (show) {
        $JssorUtils$.$ShowElement(elmt, show);
    };

    var _Initialized;
    _Self.$Reset = function (length, items, loadingContainer) {
        if (!_Initialized) {
            _Length = length;
            _CurrentIndex = -1;
            _DisplayPieces = Math.min(_DisplayPieces, items.length);

            var horizontal = _Options.$Orientation & 1;

            var slideWidth = _PrototypeWidth + (_PrototypeWidth + _SpacingX) * (_Lanes - 1) * (1 - horizontal);
            var slideHeight = _PrototypeHeight + (_PrototypeHeight + _SpacingY) * (_Lanes - 1) * horizontal;

            var slidesContainerWidth = slideWidth + (slideWidth + _SpacingX) * (_DisplayPieces - 1) * horizontal;
            var slidesContainerHeight = slideHeight + (slideHeight + _SpacingY) * (_DisplayPieces - 1) * (1 - horizontal);

            $JssorUtils$.$SetStylePosition(_SlidesContainer, "absolute");
            $JssorUtils$.$SetStyleOverflow(_SlidesContainer, "hidden");
            if (_Options.$AutoCenter) {
                $JssorUtils$.$SetStyleLeft(_SlidesContainer, (_Width - slidesContainerWidth) / 2);
                $JssorUtils$.$SetStyleTop(_SlidesContainer, (_Height - slidesContainerHeight) / 2);
            }
            $JssorDebug$.$Execute(function () {
                if (!_Options.$AutoCenter) {
                    var slidesContainerTop = $JssorUtils$.$GetStyleTop(_SlidesContainer);
                    var slidesContainerLeft = $JssorUtils$.$GetStyleLeft(_SlidesContainer);

                    if (isNaN(slidesContainerTop)) {
                        $JssorDebug$.$Fail("Position 'top' wrong specification of thumbnail navigator slides container (<div u=\"thumbnavigator\">...<div u=\"slides\">), \r\nwhen option $ThumbnailNavigatorOptions.$AutoCenter set to false, it should be specied by inline style in pixels (like <div u=\"slides\" style=\"top: 0px;\">)");
                    }

                    if (isNaN(slidesContainerLeft)) {
                        $JssorDebug$.$Fail("Position 'left' wrong specification of thumbnail navigator slides container (<div u=\"thumbnavigator\">...<div u=\"slides\">), \r\nwhen option $ThumbnailNavigatorOptions.$AutoCenter set to false, it should be specied by inline style in pixels (like <div u=\"slides\" style=\"left: 0px;\">)");
                    }
                }
            });
            $JssorUtils$.$SetStyleWidth(_SlidesContainer, slidesContainerWidth);
            $JssorUtils$.$SetStyleHeight(_SlidesContainer, slidesContainerHeight);

            var slideItemElmt;
            $JssorUtils$.$Each(items, function (item, index) {
                var navigationItem = new NavigationItem(item, index);
                var navigationItemWrapper = navigationItem.$Wrapper;
                var laneIndex = index % _Lanes;
                $JssorUtils$.$SetStyleLeft(navigationItemWrapper, (_PrototypeWidth + _SpacingX) * laneIndex * (1 - horizontal));
                $JssorUtils$.$SetStyleTop(navigationItemWrapper, (_PrototypeHeight + _SpacingY) * laneIndex * horizontal);

                if (!laneIndex) {
                    slideItemElmt = $JssorUtils$.$CreateDivElement();
                    $JssorUtils$.$AppendChild(_SlidesContainer, slideItemElmt);
                }

                $JssorUtils$.$AppendChild(slideItemElmt, navigationItemWrapper);

                _NavigationItems.push(navigationItem);
            });

            var slideshowOptions = {
                $SlideWidth: slideWidth,
                $SlideHeight: slideHeight,
                $SlideSpacing: _SpacingX * horizontal + _SpacingY * (1 - horizontal),
                $DisplayPieces: _DisplayPieces,
                $MinDragOffsetToSlide: 12,
                $SlideDuration: 200,
                $HoverToPause: true,
                $PlayOrientation: _Options.$Orientation,
                $DragOrientation: _Options.$DisableDrag ? 0 : _Options.$Orientation
            };

            if (_ParkingPosition) {
                slideshowOptions.$ParkingPosition = _ParkingPosition;
            }

            if (_DirectionNavigatorOptions) {
                slideshowOptions.$DirectionNavigatorOptions = _DirectionNavigatorOptions;
            }

            _Slideshow = new $JssorSlider$(elmt, slideshowOptions);

            _Initialized = true;
        }

        _Self.$TriggerEvent($JssorNavigatorEvents$.$RESET);
    };

    //JssorThumbnailNavigator Constructor
    {
        _Self.$Options = _Options = $JssorUtils$.$Extend({
            $SpacingX: 3,
            $SpacingY: 3,
            $DisplayPieces: 1,
            $Orientation: 1,
            $AutoCenter: true
        }, options);

        //Sodo statement for development time intelligence only
        $JssorDebug$.$Execute(function () {
            _Options = $JssorUtils$.$Extend({
                $Lanes: undefined,
                $Width: undefined,
                $Height: undefined,
                $ParkingPosition: undefined,
                $DirectionNavigatorOptions: undefined
            }, _Options);
        });

        _Width = $JssorUtils$.$GetStyleWidth(elmt);
        _Height = $JssorUtils$.$GetStyleHeight(elmt);

        $JssorDebug$.$Execute(function () {
            if (!_Width)
                $JssorDebug$.$Fail("width of 'thumbnavigator' container not specified.");
            if (!_Height)
                $JssorDebug$.$Fail("height of 'thumbnavigator' container not specified.");
        });

        _SlidesContainer = $JssorUtils$.$FindFirstChildByAttribute(elmt, "slides");
        _ThumbnailPrototype = $JssorUtils$.$FindFirstChildByAttribute(_SlidesContainer, "prototype");

        $JssorDebug$.$Execute(function () {
            if (!_ThumbnailPrototype)
                $JssorDebug$.$Fail("prototype of 'thumbnailnavigator' not defined.");
        });

        $JssorUtils$.$RemoveChild(_SlidesContainer, _ThumbnailPrototype);

        _Lanes = _Options.$Lanes || 1;
        _SpacingX = _Options.$SpacingX;
        _SpacingY = _Options.$SpacingY;
        _PrototypeWidth = $JssorUtils$.$GetStyleWidth(_ThumbnailPrototype);
        _PrototypeHeight = $JssorUtils$.$GetStyleHeight(_ThumbnailPrototype);
        _DisplayPieces = _Options.$DisplayPieces;
        _ParkingPosition = _Options.$ParkingPosition;
        _DirectionNavigatorOptions = _Options.$DirectionNavigatorOptions;
    }
}