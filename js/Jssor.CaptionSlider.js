/// <reference path="Jssor.Core.js" />
/// <reference path="Jssor.Debug.js" />
/// <reference path="Jssor.Easing.js" />
/// <reference path="Jssor.Utils.js" />

/*
* Jssor.CaptionSlider 6.0
* 
* TERMS OF USE - Jssor.CaptionSlider
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

function $JssorCaptionSliderBase$(container, captionElmts, captionSlideOptions) {
    var self = this;
    $JssorAnimator$.call(self, 0, 0);

    self.$CaptionElementWidth = $JssorUtils$.$GetStyleWidth(container);
    self.$CaptionElementHeight = $JssorUtils$.$GetStyleHeight(container);

    var captionItems;
    self.$GetCaptionItems = function () {
        if (!captionItems) {
            var itemsToPlay = [];
            $JssorUtils$.$Each(captionElmts, function (captionItem, i) {

                var transition;

                var transitionAttr = $JssorUtils$.$GetAttribute(captionItem, "t");
                if (transitionAttr) {
                    transitionIndex = parseInt(transitionAttr, 10);

                    //Now support named caption transition
                    transition = captionSlideOptions.$CaptionTransitions[transitionIndex] || captionSlideOptions.$CaptionTransitions[transitionAttr];

                    transition = $JssorUtils$.$Extend({
                        $Duration: 400  //Duration to finish the transition
                        , $Delay: 200   //Delay to start the transition since the previous transition started
                        , $Opacity: 0   //Fade block or not
                        , $Zoom: 0      //Zoom block or not
                        , $Clip: 0      //Clip item or not
                        , $Move: false  //Move caption or not
                        , $FlyDirection: 0  //Specify fly transform with direction
                        , $Easing: null //Specify variation of speed during transition
                    }, transition);
                }

                if (transition) {
                    var delay = 0;

                    var delayAttr = $JssorUtils$.$GetAttribute(captionItem, "d");
                    if (delayAttr) {
                        delay = parseInt(delayAttr);
                    }

                    var combineMode = undefined;  //0 Parallel, 1 Chain

                    var combineModeFlag = $JssorUtils$.$GetAttribute(captionItem, "c");
                    if (combineModeFlag) {
                        combineMode = combineModeFlag == "0" ? 0 : 1;
                    }

                    itemsToPlay.push({ $Item: captionItem, $Transition: transition, $Delay: delay, $CombineMode: combineMode });
                }
            });

            captionItems = itemsToPlay;
        }

        return captionItems;
    };

    self.$Animating = 0;
}

function $JssorCaptionSlider$(container, captionElmts, captionSlideOptions) {
    var self = this;
    $JssorCaptionSliderBase$.call(self, container, captionElmts, captionSlideOptions);

    var _CombineMode = captionSlideOptions.$CombineMode || 1;

    function CreateAnimator(itemObject) {

        var transition = itemObject.$Transition;

        var animatorOptions = {
            $Easing: transition.$Easing,
            $Round: transition.$Round,
            $During: transition.$During,
            $HideAtStart: true
        };

        $JssorDebug$.$Execute(function () {
            animatorOptions.$CaptionAnimator = true;
        });

        var captionItem = itemObject.$Item;
        var captionItemWidth = $JssorUtils$.$GetStyleWidth(captionItem) || 0;
        var captionItemHeight = $JssorUtils$.$GetStyleHeight(captionItem) || 0;

        var toStyles = {};
        var fromStyles = {};
        var scaleClip = transition.$ScaleClip || 1;

        //Opacity
        if (transition.$Opacity) {
            toStyles.$Opacity = 2 - transition.$Opacity;
        }

        //Transform
        if (transition.$Zoom || transition.$Rotate) {
            toStyles.$Zoom = transition.$Zoom ? transition.$Zoom - 1 : 1;
            fromStyles.$Zoom = 1;

            toStyles.$Rotate = transition.$Rotate ? 360 : 0;
            fromStyles.$Rotate = 0;

            animatorOptions.$OriginalWidth = captionItemWidth;
            animatorOptions.$OriginalHeight = captionItemHeight;
        }
        //Clip
        else if (transition.$Clip) {
            var fromStyleClip = { $Top: 0, $Right: captionItemWidth, $Bottom: captionItemHeight, $Left: 0 };
            var toStyleClip = $JssorUtils$.$Extend({}, fromStyleClip);

            var blockOffset = toStyleClip.$Offset = {};

            var topBenchmark = transition.$Clip & 4;
            var bottomBenchmark = transition.$Clip & 8;
            var leftBenchmark = transition.$Clip & 1;
            var rightBenchmark = transition.$Clip & 2;

            if (topBenchmark && bottomBenchmark) {
                blockOffset.$Top = captionItemHeight / 2 * scaleClip;
                blockOffset.$Bottom = -blockOffset.$Top;
            }
            else if (topBenchmark)
                blockOffset.$Bottom = -captionItemHeight * scaleClip;
            else if (bottomBenchmark)
                blockOffset.$Top = captionItemHeight * scaleClip;

            if (leftBenchmark && rightBenchmark) {
                blockOffset.$Left = captionItemWidth / 2 * scaleClip;
                blockOffset.$Right = -blockOffset.$Left;
            }
            else if (leftBenchmark)
                blockOffset.$Right = -captionItemWidth * scaleClip;
            else if (rightBenchmark)
                blockOffset.$Left = captionItemWidth * scaleClip;

            animatorOptions.$Move = transition.$Move;
            toStyles.$Clip = toStyleClip;
            fromStyles.$Clip = fromStyleClip;
        }

        //Fly
        {
            var direction = transition.$FlyDirection;

            var toLeft = 0;
            var toTop = 0;

            var scaleHorizontal = transition.$ScaleHorizontal || 1;
            var scaleVertical = transition.$ScaleVertical || 1;

            if ($JssorDirection$.$IsToLeft(direction)) {
                toLeft -= self.$CaptionElementWidth * scaleHorizontal;
            }
            else if ($JssorDirection$.$IsToRight(direction)) {
                toLeft += self.$CaptionElementWidth * scaleHorizontal;
            }

            if ($JssorDirection$.$IsToTop(direction)) {
                toTop -= self.$CaptionElementHeight * scaleVertical;
            }
            else if ($JssorDirection$.$IsToBottom(direction)) {
                toTop += self.$CaptionElementHeight * scaleVertical;
            }

            if (toLeft || toTop || animatorOptions.$Move) {
                toStyles.$Left = toLeft + $JssorUtils$.$GetStyleLeft(captionItem);
                toStyles.$Top = toTop + $JssorUtils$.$GetStyleTop(captionItem);
            }
        }

        fromStyles = $JssorUtils$.$Extend(fromStyles, $JssorUtils$.$GetStyles(captionItem, toStyles));

        animatorOptions.$Setter = $JssorUtils$.$GetStyleSetterEx();

        return new $JssorAnimator$(itemObject.$Delay, transition.$Duration, animatorOptions, captionItem, fromStyles, toStyles);
    }

    //Constructor
    {
        var captionItems = self.$GetCaptionItems();

        $JssorUtils$.$Each(captionItems, function (captionItem) {
            var animator = CreateAnimator(captionItem);

            var combineMode = _CombineMode;
            if (!$JssorUtils$.$IsUndefined(captionItem.$CombineMode))
                combineMode = captionItem.$CombineMode;
            self.$Join(animator, combineMode);
        });
    }
}