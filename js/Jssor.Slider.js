/// <reference path="Jssor.Core.js" />
/// <reference path="Jssor.Debug.js" />
/// <reference path="Jssor.EventManager.js />
/// <reference path="Jssor.Point.js" />
/// <reference path="Jssor.Utils.js" />
/// <reference path="Jssor.Easing.js" />
/// <reference path="Jssor.CaptionSlider.js" />

/**
* Jssor.Slider
* Version: 6.0
* Author: roc cheng (zazanaire@live.com)
*
* (c) 2009-2013 Zazanaire. All rights reserved. http://slideshow.jssor.com
**/

var $JssorSlider$;
var $JssorSlideshowFormations$ = {};
var $GeomeSlideshowFormations = $JssorSlideshowFormations$;
var $JssorSlideshowRunner$;

new function () {
    //Constants +++++++

    var COLUMN_INCREASE = 0;
    var COLUMN_DECREASE = 1;
    var ROW_INCREASE = 2;
    var ROW_DECREASE = 3;

    var DIRECTION_HORIZONTAL = 0x0003;
    var DIRECTION_VERTICAL = 0x000C;

    var TO_LEFT = 0x0001;
    var TO_RIGHT = 0x0002;
    var TO_TOP = 0x0004;
    var TO_BOTTOM = 0x0008;

    var FROM_LEFT = 0x0100;
    var FROM_TOP = 0x0200;
    var FROM_RIGHT = 0x0400;
    var FROM_BOTTOM = 0x0800;

    var ASSEMBLY_BOTTOM_LEFT = FROM_BOTTOM + TO_LEFT;
    var ASSEMBLY_BOTTOM_RIGHT = FROM_BOTTOM + TO_RIGHT;
    var ASSEMBLY_TOP_LEFT = FROM_TOP + TO_LEFT;
    var ASSEMBLY_TOP_RIGHT = FROM_TOP + TO_RIGHT;
    var ASSEMBLY_LEFT_TOP = FROM_LEFT + TO_TOP;
    var ASSEMBLY_LEFT_BOTTOM = FROM_LEFT + TO_BOTTOM;
    var ASSEMBLY_RIGHT_TOP = FROM_RIGHT + TO_TOP;
    var ASSEMBLY_RIGHT_BOTTOM = FROM_RIGHT + TO_BOTTOM;

    //Constants -------

    //Formation Definition +++++++
    function isToLeft(roadValue) {
        return (roadValue & TO_LEFT) == TO_LEFT;
    }

    function isToRight(roadValue) {
        return (roadValue & TO_RIGHT) == TO_RIGHT;
    }

    function isToTop(roadValue) {
        return (roadValue & TO_TOP) == TO_TOP;
    }

    function isToBottom(roadValue) {
        return (roadValue & TO_BOTTOM) == TO_BOTTOM;
    }

    $JssorSlideshowFormations$.$FormationStraight = function (transition) {
        var cols = transition.$Cols;
        var rows = transition.$Rows;
        var formationDirection = transition.$Assembly
        var count = transition.$Count;
        var a = {};
        var i = 0;
        var c = 0;
        var r = 0;
        var cl = cols - 1;
        var rl = rows - 1;
        var il = count - 1;
        var cr;
        for (r = 0; r < rows; r++) {
            for (c = 0; c < cols; c++) {
                cr = r + ',' + c;
                switch (formationDirection) {
                    case ASSEMBLY_BOTTOM_LEFT:
                        a[cr] = il - (c * rows + (rl - r));
                        break;
                    case ASSEMBLY_RIGHT_TOP:
                        a[cr] = il - (r * cols + (cl - c));
                        break;
                    case ASSEMBLY_TOP_LEFT:
                        a[cr] = il - (c * rows + r);
                    case ASSEMBLY_LEFT_TOP:
                        a[cr] = il - (r * cols + c);
                        break;
                    case ASSEMBLY_BOTTOM_RIGHT:
                        a[cr] = c * rows + r;
                        break;
                    case ASSEMBLY_LEFT_BOTTOM:
                        a[cr] = r * cols + (cl - c);
                        break;
                    case ASSEMBLY_TOP_RIGHT:
                        a[cr] = c * rows + (rl - r);
                        break;
                    default:
                        a[cr] = r * cols + c;
                        break; //ASSEMBLY_RIGHT_BOTTOM
                }
            }
        }

        return a;
    };

    $JssorSlideshowFormations$.$FormationSwirl = function (transition) {
        var cols = transition.$Cols;
        var rows = transition.$Rows;
        var formationDirection = transition.$Assembly;
        var count = transition.$Count;
        var a = {};
        var i = 0;
        var c = 0;
        var r = 0;
        var cl = cols - 1;
        var rl = rows - 1;
        var il = count - 1;
        var cr;
        var courses;
        var course = 0;
        switch (formationDirection) {
            case ASSEMBLY_BOTTOM_LEFT:
                c = cl;
                r = 0;
                courses = [ROW_INCREASE, COLUMN_DECREASE, ROW_DECREASE, COLUMN_INCREASE];
                break;
            case ASSEMBLY_RIGHT_TOP:
                c = 0;
                r = rl;
                courses = [COLUMN_INCREASE, ROW_DECREASE, COLUMN_DECREASE, ROW_INCREASE];
                break;
            case ASSEMBLY_TOP_LEFT:
                c = cl;
                r = rl;
                courses = [ROW_DECREASE, COLUMN_DECREASE, ROW_INCREASE, COLUMN_INCREASE];
                break;
            case ASSEMBLY_LEFT_TOP:
                c = cl;
                r = rl;
                courses = [COLUMN_DECREASE, ROW_DECREASE, COLUMN_INCREASE, ROW_INCREASE];
                break;
            case ASSEMBLY_BOTTOM_RIGHT:
                c = 0;
                r = 0;
                courses = [ROW_INCREASE, COLUMN_INCREASE, ROW_DECREASE, COLUMN_DECREASE];
                break;
            case ASSEMBLY_LEFT_BOTTOM:
                c = cl;
                r = 0;
                courses = [COLUMN_DECREASE, ROW_INCREASE, COLUMN_INCREASE, ROW_DECREASE];
                break;
            case ASSEMBLY_TOP_RIGHT:
                c = 0;
                r = rl;
                courses = [ROW_DECREASE, COLUMN_INCREASE, ROW_INCREASE, COLUMN_DECREASE];
                break;
            default:
                c = 0;
                r = 0;
                courses = [COLUMN_INCREASE, ROW_INCREASE, COLUMN_DECREASE, ROW_DECREASE];
                break; //ASSEMBLY_RIGHT_BOTTOM
        }
        i = 0;
        while (i < count) {
            cr = r + ',' + c;
            if (c >= 0 && c < cols && r >= 0 && r < rows && typeof (a[cr]) == 'undefined') {
                a[cr] = i++;
            }
            else {
                switch (courses[course++ % courses.length]) {
                    case COLUMN_INCREASE:
                        c--;
                        break;
                    case ROW_INCREASE:
                        r--;
                        break;
                    case COLUMN_DECREASE:
                        c++;
                        break;
                    case ROW_DECREASE:
                        r++;
                        break;
                }
            }

            switch (courses[course % courses.length]) {
                case COLUMN_INCREASE:
                    c++;
                    break;
                case ROW_INCREASE:
                    r++;
                    break;
                case COLUMN_DECREASE:
                    c--;
                    break;
                case ROW_DECREASE:
                    r--;
                    break;
            }
        }
        return a;
    };

    $JssorSlideshowFormations$.$FormationZigZag = function (transition) {
        var cols = transition.$Cols;
        var rows = transition.$Rows;
        var formationDirection = transition.$Assembly;
        var count = transition.$Count;
        var a = {};
        var i = 0;
        var c = 0;
        var r = 0;
        var cl = cols - 1;
        var rl = rows - 1;
        var il = count - 1;
        var cr;
        var courses;
        var course = 0;
        switch (formationDirection) {
            case ASSEMBLY_BOTTOM_LEFT:
                c = cl;
                r = 0;
                courses = [ROW_INCREASE, COLUMN_DECREASE, ROW_DECREASE, COLUMN_DECREASE];
                break;
            case ASSEMBLY_RIGHT_TOP:
                c = 0;
                r = rl;
                courses = [COLUMN_INCREASE, ROW_DECREASE, COLUMN_DECREASE, ROW_DECREASE];
                break;
            case ASSEMBLY_TOP_LEFT:
                c = cl;
                r = rl;
                courses = [ROW_DECREASE, COLUMN_DECREASE, ROW_INCREASE, COLUMN_DECREASE];
                break;
            case ASSEMBLY_LEFT_TOP:
                c = cl;
                r = rl;
                courses = [COLUMN_DECREASE, ROW_DECREASE, COLUMN_INCREASE, ROW_DECREASE];
                break;
            case ASSEMBLY_BOTTOM_RIGHT:
                c = 0;
                r = 0;
                courses = [ROW_INCREASE, COLUMN_INCREASE, ROW_DECREASE, COLUMN_INCREASE];
                break;
            case ASSEMBLY_LEFT_BOTTOM:
                c = cl;
                r = 0;
                courses = [COLUMN_DECREASE, ROW_INCREASE, COLUMN_INCREASE, ROW_INCREASE];
                break;
            case ASSEMBLY_TOP_RIGHT:
                c = 0;
                r = rl;
                courses = [ROW_DECREASE, COLUMN_INCREASE, ROW_INCREASE, COLUMN_INCREASE];
                break;
            default:
                c = 0;
                r = 0;
                courses = [COLUMN_INCREASE, ROW_INCREASE, COLUMN_DECREASE, ROW_INCREASE];
                break; //ASSEMBLY_RIGHT_BOTTOM
        }
        i = 0;
        while (i < count) {
            cr = r + ',' + c;
            if (c >= 0 && c < cols && r >= 0 && r < rows && typeof (a[cr]) == 'undefined') {
                a[cr] = i++;
                switch (courses[course % courses.length]) {
                    case COLUMN_INCREASE:
                        c++;
                        break;
                    case ROW_INCREASE:
                        r++;
                        break;
                    case COLUMN_DECREASE:
                        c--;
                        break;
                    case ROW_DECREASE:
                        r--;
                        break;
                }
            }
            else {
                switch (courses[course++ % courses.length]) {
                    case COLUMN_INCREASE:
                        c--;
                        break;
                    case ROW_INCREASE:
                        r--;
                        break;
                    case COLUMN_DECREASE:
                        c++;
                        break;
                    case ROW_DECREASE:
                        r++;
                        break;
                }
                switch (courses[course++ % courses.length]) {
                    case COLUMN_INCREASE:
                        c++;
                        break;
                    case ROW_INCREASE:
                        r++;
                        break;
                    case COLUMN_DECREASE:
                        c--;
                        break;
                    case ROW_DECREASE:
                        r--;
                        break;
                }
            }
        }
        return a;
    };

    $JssorSlideshowFormations$.$FormationStraightStairs = function (transition) {
        var cols = transition.$Cols;
        var rows = transition.$Rows;
        var formationDirection = transition.$Assembly;
        var count = transition.$Count;
        var a = {};
        var i = 0;
        var c = 0;
        var r = 0;
        var cl = cols - 1;
        var rl = rows - 1;
        var il = count - 1;
        var cr;
        switch (formationDirection) {
            case ASSEMBLY_BOTTOM_LEFT:
            case ASSEMBLY_TOP_RIGHT:
            case ASSEMBLY_TOP_LEFT:
            case ASSEMBLY_BOTTOM_RIGHT:
                var C = 0;
                var R = 0;
                break;
            case ASSEMBLY_LEFT_BOTTOM:
            case ASSEMBLY_RIGHT_TOP:
            case ASSEMBLY_LEFT_TOP:
            case ASSEMBLY_RIGHT_BOTTOM:
                var C = cl;
                var R = 0;
                break;
            default:
                formationDirection = ASSEMBLY_RIGHT_BOTTOM;
                var C = cl;
                var R = 0;
                break;
        }
        c = C;
        r = R;
        while (i < count) {
            cr = r + ',' + c;
            if (isToTop(formationDirection) || isToRight(formationDirection))
                a[cr] = il - i++;
            else
                a[cr] = i++;
            switch (formationDirection) {
                case ASSEMBLY_BOTTOM_LEFT:
                case ASSEMBLY_TOP_RIGHT:
                    c--;
                    r++;
                    break;
                case ASSEMBLY_TOP_LEFT:
                case ASSEMBLY_BOTTOM_RIGHT:
                    c++;
                    r--;
                    break;
                case ASSEMBLY_LEFT_BOTTOM:
                case ASSEMBLY_RIGHT_TOP:
                    c--;
                    r--;
                    break;
                case ASSEMBLY_RIGHT_BOTTOM:
                case ASSEMBLY_LEFT_TOP:
                default:
                    c++;
                    r++;
                    break;
            }
            if (c < 0 || r < 0 || c > cl || r > rl) {
                switch (formationDirection) {
                    case ASSEMBLY_BOTTOM_LEFT:
                    case ASSEMBLY_TOP_RIGHT:
                        C++;
                        break;
                    case ASSEMBLY_LEFT_BOTTOM:
                    case ASSEMBLY_RIGHT_TOP:
                    case ASSEMBLY_TOP_LEFT:
                    case ASSEMBLY_BOTTOM_RIGHT:
                        R++;
                        break;
                    case ASSEMBLY_RIGHT_BOTTOM:
                    case ASSEMBLY_LEFT_TOP:
                    default:
                        C--;
                        break;
                }
                if (C < 0 || R < 0 || C > cl || R > rl) {
                    switch (formationDirection) {
                        case ASSEMBLY_BOTTOM_LEFT:
                        case ASSEMBLY_TOP_RIGHT:
                            C = cl;
                            R++;
                            break;
                        case ASSEMBLY_TOP_LEFT:
                        case ASSEMBLY_BOTTOM_RIGHT:
                            R = rl;
                            C++;
                            break;
                        case ASSEMBLY_LEFT_BOTTOM:
                        case ASSEMBLY_RIGHT_TOP: R = rl; C--;
                            break;
                        case ASSEMBLY_RIGHT_BOTTOM:
                        case ASSEMBLY_LEFT_TOP:
                        default:
                            C = 0;
                            R++;
                            break;
                    }
                    if (R > rl)
                        R = rl;
                    else if (R < 0)
                        R = 0;
                    else if (C > cl)
                        C = cl;
                    else if (C < 0)
                        C = 0;
                }
                r = R;
                c = C;
            }
        }
        return a;
    };

    $JssorSlideshowFormations$.$FormationSquare = function (transition) {
        var cols = transition.$Cols || 1;
        var rows = transition.$Rows || 1;
        var arr = {};
        var i = 0;
        var c;
        var r;
        var dc;
        var dr;
        var cr;
        dc = cols < rows ? (rows - cols) / 2 : 0;
        dr = cols > rows ? (cols - rows) / 2 : 0;
        cr = Math.round(Math.max(cols / 2, rows / 2)) + 1;
        for (c = 0; c < cols; c++) {
            for (r = 0; r < rows; r++)
                arr[r + ',' + c] = cr - Math.min(c + 1 + dc, r + 1 + dr, cols - c + dc, rows - r + dr);
        }
        return arr;
    };

    $JssorSlideshowFormations$.$FormationRectangle = function (transition) {
        var cols = transition.$Cols || 1;
        var rows = transition.$Rows || 1;
        var arr = {};
        var i = 0;
        var c;
        var r;
        var cr;
        cr = Math.round(Math.min(cols / 2, rows / 2)) + 1;
        for (c = 0; c < cols; c++) {
            for (r = 0; r < rows; r++)
                arr[r + ',' + c] = cr - Math.min(c + 1, r + 1, cols - c, rows - r);
        }
        return arr;
    };

    $JssorSlideshowFormations$.$FormationRandom = function (transition) {
        var a = {};
        var tmp = [];
        var r, c, i;
        for (r = 0; r < transition.$Rows; r++) {
            for (c = 0; c < transition.$Cols; c++)
                tmp.push({ $ItemValue: r + ',' + c, $ItemOrder: Math.ceil(100000 * Math.random()) % 13 });
        }

        tmp.sort(function (a, b) {
            return a.$ItemOrder - b.$ItemOrder;
        });

        for (var i = 0; i < transition.$Count; i++) {
            a[tmp[i].$ItemValue] = i;
        }

        return a;
    };

    $JssorSlideshowFormations$.$FormationCircle = function (transition) {
        var cols = transition.$Cols || 1;
        var rows = transition.$Rows || 1;
        var arr = {};
        var i = 0;
        var c;
        var r;
        var hc = cols / 2 - 0.5;
        var hr = rows / 2 - 0.5;
        for (c = 0; c < cols; c++) {
            for (r = 0; r < rows; r++)
                arr[r + ',' + c] = Math.round(Math.sqrt(Math.pow(c - hc, 2) + Math.pow(r - hr, 2)));
        }
        return arr;
    };

    $JssorSlideshowFormations$.$FormationCross = function (transition) {
        var cols = transition.$Cols || 1;
        var rows = transition.$Rows || 1;
        var arr = {};
        var i = 0;
        var c;
        var r;
        var hc = cols / 2 - 0.5;
        var hr = rows / 2 - 0.5;
        for (c = 0; c < cols; c++) {
            for (r = 0; r < rows; r++)
                arr[r + ',' + c] = Math.round(Math.min(Math.abs(c - hc), Math.abs(r - hr)));
        }
        return arr;
    };

    $JssorSlideshowFormations$.$FormationRectangleCross = function (transition) {
        var cols = transition.$Cols || 1;
        var rows = transition.$Rows || 1;
        var arr = {};
        var i = 0;
        var c;
        var r;
        var hc = cols / 2 - 0.5;
        var hr = rows / 2 - 0.5;
        var cr = Math.max(hc, hr) + 1;
        for (c = 0; c < cols; c++) {
            for (r = 0; r < rows; r++)
                arr[r + ',' + c] = Math.round(cr - Math.max(hc - Math.abs(c - hc), hr - Math.abs(r - hr))) - 1;
        }
        return arr;
    };

    function GetFormation(transition) {
        var m = 0;

        var orderFunction = transition.$Formation;

        {
            var tempSequences = [];
            var orders = orderFunction(transition);

            if (transition.$Reverse) {
                $JssorUtils$.$Each(orders, function (value, i) {
                    m = Math.max(m, value);
                });
                $JssorUtils$.$Each(orders, function (value, i) {
                    orders[i] = m - value;
                });
            }

            $JssorUtils$.$Each(orders, function (order, i) {
                var sequence = tempSequences[order];
                if (!sequence) {
                    tempSequences[order] = sequence = [];
                    sequence.$Order = order;
                }
                sequence.push(i);
            });

            var sequences = [].concat(tempSequences);

            sequences.sort(function (a, b) { return a.$Order - b.$Order; });

            return { $Orders: orders, $Sequences: sequences };
        }

    } //GetFormation

    var _PrototypeTransitions = [];
    function CreateTransitionInstance(options) {

        var _SlideshowTransition = {
            $Interval: 40,  //Delay to play next frame
            $Duration: 200, //Duration to finish the entire transition
            $Delay: 0,  //Delay to assembly blocks
            $Cols: 1,   //Number of columns
            $Rows: 1,   //Number of rows
            $Opacity: 0,   //Fade block or not
            $Zoom: 0,   //Zoom block or not
            $Clip: 0,   //Clip block or not
            $Move: false,   //Move block or not
            $SlideOut: false,   //Slide the previous slide out to display next slide instead
            $FlyDirection: 0,   //Specify fly transform with direction
            $Reverse: false,    //Reverse the assembly or not
            $Formation: $JssorSlideshowFormations$.$FormationRandom,    //Shape that assembly blocks as
            $Assembly: ASSEMBLY_RIGHT_BOTTOM,   //The way to assembly blocks
            $ChessMode: { $Column: 0, $Row: 0 },    //Chess move or fly direction
            $Easing: $JssorEasing$.$EaseSwing,  //Specify variation of speed during transition
            $Round: {},
            $Blocks: [],
            $During: {}
        };

        $JssorUtils$.$Extend(_SlideshowTransition, options);

        _SlideshowTransition.$Count = _SlideshowTransition.$Cols * _SlideshowTransition.$Rows;
        if ($JssorUtils$.$IsFunction(_SlideshowTransition.$Easing))
            _SlideshowTransition.$Easing = { $Default: _SlideshowTransition.$Easing };

        _SlideshowTransition.$FramesCount = Math.round(_SlideshowTransition.$Duration / _SlideshowTransition.$Interval);
        _SlideshowTransition.$EasingInstance = GetEasing(_SlideshowTransition);

        _SlideshowTransition.$GetBlocks = function (width, height) {
            width /= _SlideshowTransition.$Cols;
            height /= _SlideshowTransition.$Rows;
            var wh = width + 'x' + height;
            if (!_SlideshowTransition.$Blocks[wh]) {
                _SlideshowTransition.$Blocks[wh] = { $Width: width, $Height: height };
                for (var c = 0; c < _SlideshowTransition.$Cols; c++) {
                    for (var r = 0; r < _SlideshowTransition.$Rows; r++)
                        _SlideshowTransition.$Blocks[wh][r + ',' + c] = { $Top: r * height, $Right: c * width + width, $Bottom: r * height + height, $Left: c * width };
                }
            }

            return _SlideshowTransition.$Blocks[wh];
        };

        return _SlideshowTransition;
    }

    function GetEasing(transition) {
        var easing = transition.$Easing;
        if (!easing.$Default)
            easing.$Default = $JssorEasing$.$EaseSwing;

        var duration = transition.$FramesCount;

        var cache = easing.$Cache;
        if (!cache) {
            var enumerator = $JssorUtils$.$Extend({}, transition.$Easing, transition.$Round);
            cache = easing.$Cache = {};

            $JssorUtils$.$Each(enumerator, function (v, easingName) {
                var easingFunction = easing[easingName] || easing.$Default;
                var round = transition.$Round[easingName] || 1;

                if (!$JssorUtils$.$IsArray(easingFunction.$Cache))
                    easingFunction.$Cache = [];

                var easingFunctionCache = easingFunction.$Cache[duration] = easingFunction.$Cache[duration] || [];

                if (!easingFunctionCache[round]) {
                    easingFunctionCache[round] = [0];
                    for (var t = 1; t <= duration; t++) {
                        var tRound = t / duration * round;
                        var tRoundFloor = Math.floor(tRound);
                        if (tRound != tRoundFloor)
                            tRound -= tRoundFloor;
                        easingFunctionCache[round][t] = easingFunction(tRound);
                    }
                }

                cache[easingName] = easingFunctionCache;

            });
        }

        return cache;
    } //GetEasing

    //Formation Definition -------

    //JssorSlideshowRunner++++++++
    var _SlideshowRunnerCount = 0;
    $JssorSlideshowRunner$ = function (slideContainer1, slideContainer2, prevItem, slideItem, transition, slideContainerWidth, slideContainerHeight, loadingContainer, slideshowOptions, slideStoppedCallback) {

        transition = _PrototypeTransitions[transition.$Index] = _PrototypeTransitions[transition.$Index] || CreateTransitionInstance(transition);

        var self = this;

        var imageElement = slideItem.$Image;

        var slideOut = transition.$SlideOut;

        var columnRow;
        var block;
        var row;
        var image;
        var startStylesArr = {};
        var animationStylesArrs = {};   //Array of Array
        var animationBlockItems = {};
        var styleStart;
        var styleEnd;
        var styleDif;

        var blocks;
        var topBenchmark;
        var bottomBenchmark;
        var leftBenchmark;
        var rightBenchmark;
        var frameN;
        var formationInstance;
        var transitionElement = null;
        var sequences;
        var _SliderStartTime;
        var _SliderFrameCount;

        var animationCompletedBlocks = [];
        var liveStatus = true;
        var freezStatus = false;
        var cancelStatus = false;
        var _SliderAnimationTimeoutHandler;
        var _ExplicitlyStopped;
        var chessModeColumn = transition.$ChessMode.$Column || 0;
        var chessModeRow = transition.$ChessMode.$Row || 0;
        var contentMode = slideshowOptions.$ContentMode;

        function Initialize() {
            if (contentMode) {
                imageElement = slideItem.$Item;
                transition.$Zoom = 0;
            }

            imageElement = $JssorUtils$.$CloneNode(imageElement, true);
            $JssorUtils$.$ShowElement(imageElement);
            $JssorUtils$.$SetStyleLeft(imageElement, 0);

            blocks = transition.$GetBlocks(slideContainerWidth, slideContainerHeight);
            formationInstance = GetFormation(transition);

            //Evaluate startStylesArr, animationStylesArrs
            for (row = 0; row < transition.$Rows; row++) for (c = 0; c < transition.$Cols; c++) {
                columnRow = row + ',' + c;

                var chessHorizontal = false;
                var chessVertical = false;

                if (chessModeColumn && c % 2) {
                    if ($JssorDirection$.$IsHorizontal(chessModeColumn)) {
                        chessHorizontal = !chessHorizontal;
                    }
                    if ($JssorDirection$.$IsVertical(chessModeColumn)) {
                        chessVertical = !chessVertical;
                    }
                }

                if (chessModeRow && row % 2) {
                    if ($JssorDirection$.$IsHorizontal(chessModeRow)) {
                        chessHorizontal = !chessHorizontal;
                    }
                    if ($JssorDirection$.$IsVertical(chessModeRow)) {
                        chessVertical = !chessVertical;
                    }
                }

                transition.$Top = transition.$Top || (transition.$Clip & 4);
                transition.$Bottom = transition.$Bottom || (transition.$Clip & 8);
                transition.$Left = transition.$Left || (transition.$Clip & 1);
                transition.$Right = transition.$Right || (transition.$Clip & 2);

                topBenchmark = chessVertical ? transition.$Bottom : transition.$Top;
                bottomBenchmark = chessVertical ? transition.$Top : transition.$Bottom;
                leftBenchmark = chessHorizontal ? transition.$Right : transition.$Left;
                rightBenchmark = chessHorizontal ? transition.$Left : transition.$Right;

                //$JssorDebug$.$Execute(function () {
                //    topBenchmark = bottomBenchmark = leftBenchmark = rightBenchmark = false;
                //});

                transition.$Clip = topBenchmark || bottomBenchmark || leftBenchmark || rightBenchmark;
                if (transition.$Fade)
                    transition.$Opacity = 2;

                styleDif = {};
                styleEnd = { $Top: 0, $Left: 0, $Opacity: 1, $Width: slideContainerWidth, $Height: slideContainerHeight };
                styleStart = $JssorUtils$.$Extend({}, styleEnd);
                block = $JssorUtils$.$Extend({}, blocks[columnRow]);

                if (transition.$Opacity) {
                    styleEnd.$Opacity = 2 - transition.$Opacity;
                }

                if (transition.$Zoom == true)
                    transition.$Zoom = 1;
                if (transition.$Zoom || transition.$Rotate) {
                    styleEnd.$Zoom = transition.$Zoom ? transition.$Zoom - 1 : 1;
                    styleStart.$Zoom = 1;

                    styleEnd.$Rotate = transition.$Rotate ? 360 : 0;
                    styleStart.$Rotate = 0;
                }
                else {
                    if (transition.$Clip) {
                        var clipScale = transition.$ScaleClip || 1;
                        var blockOffset = block.$Offset = {};
                        if (topBenchmark && bottomBenchmark) {
                            blockOffset.$Top = blocks.$Height / 2 * clipScale;
                            blockOffset.$Bottom = -blockOffset.$Top;
                        }
                        else if (topBenchmark) {
                            blockOffset.$Bottom = -blocks.$Height * clipScale;
                        }
                        else if (bottomBenchmark) {
                            blockOffset.$Top = blocks.$Height * clipScale;
                        }

                        if (leftBenchmark && rightBenchmark) {
                            blockOffset.$Left = blocks.$Width / 2 * clipScale;
                            blockOffset.$Right = -blockOffset.$Left;
                        }
                        else if (leftBenchmark) {
                            blockOffset.$Right = -blocks.$Width * clipScale;
                        }
                        else if (rightBenchmark) {
                            blockOffset.$Left = blocks.$Width * clipScale;
                        }
                    }

                    styleDif.$Clip = block;
                    styleStart.$Clip = blocks[columnRow];
                }

                if (transition.$FlyDirection) {
                    var direction = transition.$FlyDirection;

                    if (!chessHorizontal)
                        direction = $JssorDirection$.$ChessHorizontal(direction);

                    if (!chessVertical)
                        direction = $JssorDirection$.$ChessVertical(direction);

                    var scaleHorizontal = transition.$ScaleHorizontal || 1;
                    var scaleVertical = transition.$ScaleVertical || 1;

                    if ($JssorDirection$.$IsToLeft(direction)) {
                        styleEnd.$Left += slideContainerWidth * scaleHorizontal;
                    }
                    else if ($JssorDirection$.$IsToRight(direction)) {
                        styleEnd.$Left -= slideContainerWidth * scaleHorizontal;
                    }
                    if ($JssorDirection$.$IsToTop(direction)) {
                        styleEnd.$Top += slideContainerHeight * scaleVertical;
                    }
                    else if ($JssorDirection$.$IsToBottom(direction)) {
                        styleEnd.$Top -= slideContainerHeight * scaleVertical;
                    }
                }

                $JssorUtils$.$Each(styleEnd, function (propertyEnd, property) {
                    if ($JssorUtils$.$IsNumeric(propertyEnd)) {
                        if (propertyEnd != styleStart[property]) {
                            styleDif[property] = propertyEnd - styleStart[property];
                        }
                    }
                });

                startStylesArr[columnRow] = slideOut ? styleStart : styleEnd;

                var animationStylesArr = [];
                var virtualFrameCount = Math.round(formationInstance.$Orders[columnRow] * transition.$Delay / transition.$Interval);
                animationStylesArrs[columnRow] = new Array(virtualFrameCount);
                animationStylesArrs[columnRow].$Min = virtualFrameCount;

                var framesCount = transition.$FramesCount;
                for (frameN = 0; frameN <= framesCount; frameN++) {
                    var styleFrameN = {};

                    $JssorUtils$.$Each(styleDif, function (propertyDiff, property) {
                        var propertyEasings = transition.$EasingInstance[property] || transition.$EasingInstance.$Default;
                        var propertyEasingArray = propertyEasings[transition.$Round[property] || 1];

                        var propertyDuring = transition.$During[property] || [0, 1];
                        var propertyFrameN = (frameN / framesCount - propertyDuring[0]) / propertyDuring[1] * framesCount;
                        propertyFrameN = Math.round(Math.min(framesCount, Math.max(propertyFrameN, 0)));

                        var propertyEasingValue = propertyEasingArray[framesCount - propertyFrameN];

                        if ($JssorUtils$.$IsNumeric(propertyDiff)) {
                            styleFrameN[property] = styleStart[property] + propertyDiff * propertyEasingValue;
                        }
                        else {
                            var value = styleFrameN[property] = $JssorUtils$.$Extend({}, styleStart[property]);
                            value.$Offset = [];
                            $JssorUtils$.$Each(propertyDiff.$Offset, function (rectX, n) {
                                var offsetValue = rectX * propertyEasingValue;
                                value.$Offset[n] = offsetValue;
                                value[n] += offsetValue;
                            });
                        }
                    });

                    if (styleStart.$Zoom) {
                        styleFrameN.$Transform = { $Rotate: styleFrameN.$Rotate || 0, $Scale: styleFrameN.$Zoom, $OriginalWidth: slideContainerWidth, $OriginalHeight: slideContainerHeight };
                    }
                    if (styleFrameN.$Clip && transition.$Move) {
                        var styleFrameNClipOffset = styleFrameN.$Clip.$Offset;
                        var offsetY = (styleFrameNClipOffset.$Top || 0) + (styleFrameNClipOffset.$Bottom || 0);
                        var offsetX = (styleFrameNClipOffset.$Left || 0) + (styleFrameNClipOffset.$Right || 0);

                        styleFrameN.$Left = (styleFrameN.$Left || 0) + offsetX;
                        styleFrameN.$Top = (styleFrameN.$Top || 0) + offsetY;
                        styleFrameN.$Clip.$Left -= offsetX;
                        styleFrameN.$Clip.$Right -= offsetX;
                        styleFrameN.$Clip.$Top -= offsetY;
                        styleFrameN.$Clip.$Bottom -= offsetY;
                    }

                    //To improve performance, not too much difference
                    //var hideFrame = false;
                    //if (styleFrameN.$Opacity == 0) {
                    //    hideFrame = true;
                    //}
                    //else if (transition.$Outside) {
                    //    if (styleFrameN.$Clip) {
                    //        var top = styleFrameN.$Top + styleFrameN.$Clip.$Top;
                    //        var bottom = styleFrameN.$Top + styleFrameN.$Clip.$Bottom;
                    //        var left = styleFrameN.$Left + styleFrameN.$Clip.$Left;
                    //        var right = styleFrameN.$Left + styleFrameN.$Clip.Right;

                    //        hideFrame |= top >= slideContainerHeight || bottom <= 0 || left >= slideContainerWidth || right < 0;
                    //    }
                    //}

                    //if (hideFrame)
                    //    styleFrameN = { $Display: "none" };
                    //else
                    styleFrameN.$Display = "";

                    animationStylesArrs[columnRow].push(styleFrameN);
                }

            } //for

            var prevItemRepresentElement = loadingContainer;

            if (prevItem) {
                if (contentMode)
                    prevItemRepresentElement = prevItem.$Item;
                else if (prevItem.$ImageLoaded())
                    prevItemRepresentElement = prevItem.$Image;
            }

            prevItemRepresentElement = $JssorUtils$.$CloneNode(prevItemRepresentElement, true);
            $JssorUtils$.$ShowElement(prevItemRepresentElement);
            $JssorUtils$.$SetStyleLeft(prevItemRepresentElement, 0);

            if (slideOut) {
                transitionElement = prevItemRepresentElement;
            }
            else {
                slideContainer1.$SetInnerElement(prevItemRepresentElement);
                transitionElement = imageElement;
            }

            $JssorDebug$.$Execute(function () {
                $JssorUtils$.$RemoveAttribute(transitionElement, "id");
                $JssorUtils$.$RemoveAttribute(imageElement, "id");
            });

            sequences = formationInstance.$Sequences;

            $JssorUtils$.$Each(sequences, function (sequence, order) {
                if (sequence) {
                    for (var i = 0; i < sequence.length; i++) {
                        var columnRow = sequence[i];

                        image = $JssorUtils$.$CloneNode(transitionElement, true);
                        $JssorUtils$.$SetStyles(image, startStylesArr[columnRow]);
                        $JssorUtils$.$SetStyleOverflow(image, "hidden");

                        $JssorUtils$.$SetStylePosition(image, "absolute");
                        slideContainer2.$AddClipElement(image);
                        animationBlockItems[columnRow] = image;
                        $JssorUtils$.$ShowElement(animationBlockItems[columnRow], slideOut);
                    }
                }
            });

            if (slideOut) {
                slideContainer1.$SetInnerElement(imageElement);
            }

            //Animation
            _SliderStartTime = $JssorUtils$.$GetNow();
            _SliderFrameCount = 1;
            $JssorUtils$.$Each(animationStylesArrs, function (value, index) {
                _SliderFrameCount = Math.max(value.length, _SliderFrameCount);
            });

            _FrameCurrent = 0;
        }

        function ShowFrame() {
            if (liveStatus && !freezStatus) {
                var frameC = Math.ceil(($JssorUtils$.$GetNow() - _SliderStartTime) / transition.$Interval) - 1;
                if (frameC >= _SliderFrameCount - 1) {
                    if (!slideOut)
                        slideContainer1.$SetInnerElement(imageElement);
                    slideContainer2.$Clear();

                    liveStatus = false;
                }
                else {
                    $JssorUtils$.$Each(animationStylesArrs, !liveStatus || freezStatus ? $JssorUtils$.$EmptyFunction : function (value, index) {
                        var frameIndex = frameC;
                        if (slideOut) {
                            frameIndex = _SliderFrameCount - frameC - 1;
                            frameIndex = Math.max(frameIndex, value.$Min);
                        }
                        frameIndex = Math.min(frameIndex, value.length - 1);
                        if (value[frameIndex]) {
                            $JssorUtils$.$SetStylesEx(animationBlockItems[index], value[frameIndex]);
                        }
                    });
                }
            }

            return liveStatus;
        }

        function customSetInterval(interval) {
            function runtTimeoutFunc() {
                if (!cancelStatus) {
                    if (freezStatus || ShowFrame()) {
                        _SliderAnimationTimeoutHandler = $JssorUtils$.$Delay(runtTimeoutFunc, interval);
                    }
                    else {
                        stopInternal();

                        $JssorDebug$.$Execute(function () { _SlideshowRunnerCount--; });
                        //$JssorDebug$.$Trace(_SlideshowRunnerCount + " Slideshows Running");
                    }
                }
                else {
                    $JssorDebug$.$Execute(function () { _SlideshowRunnerCount--; });
                    //$JssorDebug$.$Trace(_SlideshowRunnerCount + " Slideshows Running");
                }
            }

            $JssorDebug$.$Execute(function () { _SlideshowRunnerCount++; });
            //$JssorDebug$.$Trace(_SlideshowRunnerCount + " Slideshows Running");

            _SliderAnimationTimeoutHandler = $JssorUtils$.$Delay(runtTimeoutFunc, interval);
        }

        var _CalledBack;
        function stopInternal() {
            if (!_CalledBack) {
                _CalledBack = true;
                if (slideStoppedCallback)
                    slideStoppedCallback();
            }
        }

        self.$Stop = function () {
            if (!_ExplicitlyStopped) {
                _ExplicitlyStopped = true;
                _SliderStartTime -= 2000000;
                //_FrameCurrent = _SliderFrameCount;

                return true;
            }
        };

        self.$Play = function () {
            customSetInterval(transition.$Interval);
        };

        self.$Initialize = function () {
            Initialize();
        };

        var _TimeLeft;
        //var _FrameCurrent;
        self.$Freez = function () {
            if (!freezStatus) {
                freezStatus = true;
                _TimeLeft = $JssorUtils$.$GetNow() - _SliderStartTime;
            }
        };

        self.$Cancel = function () {

            $JssorDebug$.$Execute(function () {
                if (!cancelStatus)
                    slideItem.$StampSlideItemElements("canceledslideitem");

                self.$TempLeakElement = $JssorUtils$.$CreateDivElement();
                $JssorUtils$.$SetAttribute(self.$TempLeakElement, "id", "SlideshowRunnerTempLeakElement");
            });

            cancelStatus = true;
        };

        self.$Unfreez = function () {
            if (freezStatus) {
                freezStatus = false;
                _SliderStartTime = $JssorUtils$.$GetNow() - _TimeLeft;
            }
        };

        self.$Transition = transition;

        $JssorDebug$.$Execute(function () {
            self.$TempNoLeakElement = $JssorUtils$.$CreateDivElement();
            $JssorUtils$.$SetAttribute(self.$TempNoLeakElement, "id", "SlideshowRunnerTempNoLeakElement");
        });
    }
    //JssorSlideshowRunner--------

    function JssorSlider(elmt, options) {

        function GetTransition() {
            var n = 0;

            if (_Transitions) { /*Sequence*/
                n = _TransitionIndex % _Transitions.length;
            }
            else { /*Random*/
                n = Math.floor(Math.random() * _Transitions.length);
            }

            _TransitionIndex++;

            _Transitions[n].$Index = n;

            return _Transitions[n];
        }

        function SetPosition(elmt, position) {
            var orientation = _DragOrientation > 0 ? _DragOrientation : _Options.$PlayOrientation;

            $JssorUtils$.$SetStyleLeft(elmt, _StepLengthX * position * (orientation & 1));
            $JssorUtils$.$SetStyleTop(elmt, _StepLengthY * position * ((orientation >> 1) & 1));
        }

        function LinkClickEventHandler(event) {
            if (_LastDragSucceded) {
                $JssorUtils$.$CancelEvent(event);
            }
        }

        function SlideContainer() {
            var self = this;
            var elmt = $JssorUtils$.$CreateDivElement();
            $JssorUtils$.$SetStyles(elmt, _StyleDef);
            $JssorUtils$.$SetStylePosition(elmt, "absolute");
            //$JssorUtils$.$SetStyleOverflow(elmt, "hidden");
            var innerElement;

            self.$Elmt = elmt;

            self.$SetInnerElement = function (elmtToSet) {
                var elementToSet = $JssorUtils$.$CloneNode(elmtToSet, true);

                $JssorUtils$.$ClearInnerHtml(elmt);
                $JssorUtils$.$AppendChild(elmt, elementToSet);

                innerElement = elementToSet;
            };

            self.$AddClipElement = function (clipElement) {
                $JssorUtils$.$AppendChild(elmt, clipElement);
            };

            self.$Clear = function () {
                innerElement = null;
                $JssorUtils$.$ClearInnerHtml(elmt);
            };

            self.$GetInnerElement = function () {
                return innerElement;
            };
        }

        function SlideItem(slideBoard, slideElmt, index) {
            var _SelfSlideItem = this;
            $JssorAnimator$.call(_SelfSlideItem, -_DisplayPieces, _DisplayPieces + 1, { $SlideItemAnimator: true });

            var _CaptionSlider;
            var _IsCaptionSliderPlayingWhenDragStart;

            var _Wrapper;
            var _BaseElement = slideElmt;

            var loadingContainer;

            var links;

            var imageItem;
            var linkItem;
            var _ImageLoaded;

            //For debug only
            var _SequenceNumber;

            function LoadImageCompleteEventHandler(completeCallback) {
                _ImageLoaded = true;

                if (loadingContainer)
                    $JssorUtils$.$HideElement(loadingContainer);

                if (completeCallback)
                    completeCallback(_SelfSlideItem);
            }

            function CaptionAnimateComplete(callback) {
                if (callback)
                    callback();
            }

            function DragStartEventHandler() {
                _IsCaptionSliderPlayingWhenDragStart = _CaptionSlider.$IsPlaying();
                _CaptionSlider.$Stop();
            }

            function ParkEventHandler(previousIndex, currentIndex) {
                _IsCaptionSliderPlayingWhenDragStart = false;
                if (currentIndex != index) {
                    _SelfSlideItem.$UnhideContentForSlideshow();
                    _CaptionSlider.$GoToEnd();
                }
            }

            _SelfSlideItem.$Index = index;

            _SelfSlideItem.$LoadImage = function (completeCallback) {
                if (_SelfSlideItem.$Image) {
                    if (!_ImageLoaded) {
                        var src = _SelfSlideItem.$Image.src;
                        if (loadingContainer && _ShowLoading)
                            $JssorUtils$.$ShowElement(loadingContainer);
                        return $JssorUtils$.$LoadImage(src, $JssorUtils$.$CreateCallback(null, LoadImageCompleteEventHandler, completeCallback));
                    }
                }

                if (completeCallback)
                    completeCallback(_SelfSlideItem);
            };

            _SelfSlideItem.$ImageLoaded = function () {
                return _ImageLoaded;
            };

            _SelfSlideItem.$UncaptureLinkClick = function (linkClickEventHandler) {
                $JssorUtils$.$Each(links, function (link, i) {
                    $JssorUtils$.$RemoveEvent(link, "click", linkClickEventHandler);
                });
            };

            _SelfSlideItem.$CaptureLinkClick = function (linkClickEventHandler) {
                $JssorUtils$.$Each(links, function (link, i) {
                    $JssorUtils$.$AddEvent(link, "click", linkClickEventHandler);
                });
            };

            _SelfSlideItem.$FreeSlideItemResource = function () {
                $JssorDebug$.$Execute(function () {
                    _SlideItemReleasedCount++;
                });
                $JssorDebug$.$Trace("Slide Released: " + _SlideItemReleasedCount);

                $JssorUtils$.$FreeElement(_Wrapper);
            };

            _SelfSlideItem.$StampSlideItemElements = function (stamp) {
                stamp = _SequenceNumber + "_" + stamp;

                $JssorDebug$.$Execute(function () {
                    if (imageItem)
                        $JssorUtils$.$SetAttribute(imageItem, "id", stamp + "_slide_item_image_id");

                    $JssorUtils$.$SetAttribute(slideElmt, "id", stamp + "_slide_item_item_id");
                });

                $JssorDebug$.$Execute(function () {
                    $JssorUtils$.$SetAttribute(_Wrapper, "id", stamp + "_slide_item_wrapper_id");
                });

                $JssorDebug$.$Execute(function () {
                    if (loadingContainer)
                        $JssorUtils$.$SetAttribute(loadingContainer, "id", stamp + "_loading_container_id");
                });
            };

            _SelfSlideItem.$HideContentForSlideshow = function () {
                //$JssorUtils$.$SetStyleOpacity(slideElmt, 0);
                $JssorUtils$.$HideElement(slideElmt);
            };

            _SelfSlideItem.$UnhideContentForSlideshow = function () {
                //$JssorUtils$.$SetStyleOpacity(slideElmt, 1);
                $JssorUtils$.$ShowElement(slideElmt);
            };

            _SelfSlideItem.$EnsureCaptionSlider = function () {
                if (!_CaptionSlider || _CaptionSlider.$Version != _CaptionSliderOptions.$Version) {
                    if (_CaptionSlider)
                        _CaptionSlider.$GoToBegin();
                    var _CaptionElmts = $JssorUtils$.$FindChildrenByAttribute(slideElmt, "caption");

                    _CaptionSlider = new _CaptionSliderOptions.$Class(slideElmt, _CaptionElmts, _CaptionSliderOptions);
                    _CaptionSlider.$GoToEnd();

                    _CaptionSlider.$Version = _CaptionSliderOptions.$Version = _CaptionSliderOptions.$Version || $JssorUtils$.$GetNow();
                }

                return _CaptionSlider;
            };

            _SelfSlideItem.$OnAfterOut = function () {
                _SelfSlideItem.$UnhideContentForSlideshow();
            };

            _SelfSlideItem.$OnAfterIn = function (callback, afterSlideshow) {
                if (afterSlideshow)
                    _SelfSlideItem.$UnhideContentForSlideshow();

                if (!IsCurrentSlideIndex(index)) {
                    if (_CaptionSliderOptions.$PlayInMode == 2 && afterSlideshow || _CaptionSliderOptions.$PlayInMode == 1) {
                        _SelfSlideItem.$EnsureCaptionSlider().$GoToEnd();
                    }
                }

                _SelfSlideItem.$EnsureCaptionSlider().$PlayToBegin(callback);
            };

            _SelfSlideItem.$OnBeforeOut = function (callback, beforeSlideshow) {
                if (_CaptionSliderOptions.$PlayInMode == 2 && beforeSlideshow || _CaptionSliderOptions.$PlayOutMode == 1) {
                    //_CaptionSlider.$GoToBegin();
                    _CaptionSlider.$PlayToEnd(callback);
                }
                else {
                    callback && callback();
                }
            };

            _SelfSlideItem.$OnInnerOffsetChange = function (oldOffset, newOffset) {
                var slidePosition = _DisplayPieces - newOffset;
                SetPosition(_Wrapper, slidePosition);

                if (!_IsDragging || !_IsCaptionSliderPlayingWhenDragStart) {
                    var _DealWithParallax;
                    if (IsCurrentSlideIndex(index)) {
                        if (_CaptionSliderOptions.$PlayOutMode == 2)
                            _DealWithParallax = true;
                    }
                    else {
                        if (!_CaptionSliderOptions.$PlayInMode) {
                            //PlayInMode: 0 none
                            _CaptionSlider.$GoToBegin();
                        }
                        //else if (_CaptionSliderOptions.$PlayInMode == 1) {
                        //    //PlayInMode: 1 chain
                        //    _CaptionSlider.$GoToEnd();
                        //}
                        else if (_CaptionSliderOptions.$PlayInMode == 2) {
                            //PlayInMode: 2 parallel
                            _DealWithParallax = true;
                        }
                    }

                    if (_DealWithParallax) {
                        _CaptionSlider.$GoToPosition((_CaptionSlider.$GetPosition_OuterEnd() - _CaptionSlider.$GetPosition_OuterBegin()) * Math.abs(newOffset - 1) * .8 + _CaptionSlider.$GetPosition_OuterBegin());
                    }
                }
            };

            //SlideItem Constructor
            {
                var thumb = $JssorUtils$.$FindFirstChildByAttribute(slideElmt, "thumb");
                if (thumb) {
                    _SelfSlideItem.$Thumb = $JssorUtils$.$CloneNode(thumb, true);
                    //$JssorUtils$.$RemoveChild(slideElmt, thumb);
                    $JssorUtils$.$HideElement(thumb);
                }
                $JssorUtils$.$ShowElement(slideElmt);

                if (_LoadingContainer)
                    loadingContainer = $JssorUtils$.$CloneNode(_LoadingContainer, true);

                //Cancel click event on <A> element when a drag slide succeeded
                links = $JssorUtils$.$FindChildrenByTag(slideElmt, "A", true);

                imageItem = $JssorUtils$.$FindFirstChildByAttribute(slideElmt, "image");

                if (imageItem) {
                    if (imageItem.tagName == "A") {
                        linkItem = $JssorUtils$.$CloneNode(imageItem, false);

                        $JssorUtils$.$AddEvent(linkItem, "click", LinkClickEventHandler);
                        $JssorUtils$.$SetStyles(linkItem, _StyleDef);
                        $JssorUtils$.$SetStyleDisplay(linkItem, "block");
                        $JssorUtils$.$SetStyleOpacity(linkItem, 0);
                        $JssorUtils$.$SetStyleBackgroundColor(linkItem, "#000");

                        imageItem = $JssorUtils$.$FindFirstChildByTag(imageItem, "IMG");
                        imageItem.border = 0;
                    }

                    $JssorUtils$.$SetStyles(imageItem, _StyleDef);
                }

                _SelfSlideItem.$Image = imageItem;
                _SelfSlideItem.$Link = linkItem;

                _SelfSlideItem.$Item = slideElmt;

                _SelfSlideItem.$Wrapper = _Wrapper = CreatePanel();
                $JssorUtils$.$AppendChild(_Wrapper, slideElmt);

                if (loadingContainer)
                    $JssorUtils$.$AppendChild(_Wrapper, loadingContainer);

                _SelfSlideItem.$LoadImage($JssorUtils$.$EmptyFunction);

                _SelfSlideItem.$EnsureCaptionSlider();

                slideBoard.$AddEventListener(1, ParkEventHandler);
                slideBoard.$AddEventListener(2, DragStartEventHandler);

                $JssorDebug$.$Execute(function () {
                    _SequenceNumber = _SlideItemCreatedCount++;
                });
            }
        }

        //SlideBoard
        function SlideBoard() {
            var self = this;
            $JssorEventManager$.call(self);

            var elmt = CreatePanel();
            var _Indices = [];
            var _Panels = [];

            var _SlideItems = [];

            var _SlideshowRunner;
            var _SlideshowRunners = []; //For debug only
            var _SlideContainer1;
            var _SlideContainer2;
            var _LinkContainer;
            var _PositionToGoByDrag;

            var _DownEvent = "mousedown";
            var _MoveEvent = "mousemove";
            var _UpEvent = "mouseup";
            var _CancelEvent = "mouseup";

            //Inherit $JssorEventManager$
            $JssorEventManager$.call(self);

            //Event handling begin

            function OnMouseDown(event) {
                if (!_IsRequesting) {
                    OnDragStart(event);
                } else if (!_HandleTouchEventOnly) {
                    $JssorUtils$.$CancelEvent(event);
                }
            }

            var _LastTimeMoveByDrag;
            var _DragStartPositionDisplay;
            var _DragStart_CarouselPlaying;
            var _DragStartPlayToPosition;
            function OnDragStart(event) {
                var isDragging = _IsDragging;

                _LastTimeMoveByDrag = $JssorUtils$.$GetNow() - 50;
                _DragStart_CarouselPlaying = _IsSliderRunning;
                _DragStartPlayToPosition = _CarouselPlayer.$GetPlayToPosition();
                _CarouselPlayer.$Stop();

                if (!_DragStart_CarouselPlaying)
                    _DragOrientation = 0;

                _LastDragSucceded = false;
                _IsDragging = true;

                if (_SlideshowRunner) {
                    ShowSlideshowPanel();
                    _SlideshowRunner.$Freez();
                    _IsSlideshowFrozen = true;
                }

                if (_HandleTouchEventOnly) {
                    var touchPoint = event.touches[0];
                    _DragStartMouseX = touchPoint.clientX;
                    _DragStartMouseY = touchPoint.clientY;
                }
                else {
                    var mousePoint = $JssorUtils$.$GetMousePosition(event);

                    _DragStartMouseX = mousePoint.x;
                    _DragStartMouseY = mousePoint.y;

                    $JssorUtils$.$CancelEvent(event);
                }

                _DragOffset = 0;
                _DragStartPositionDisplay = _Carousel.$GetPosition_Display();

                if (!isDragging)
                    $JssorUtils$.$AddEvent(document, _MoveEvent, OnDragMove);

                //Trigger EVENT_DRAGSTART
                self.$TriggerEvent(2);
            }

            function OnDragMove(event) {
                var actionPoint;

                if (_HandleTouchEventOnly) {
                    var touches = event.touches;
                    if (touches && touches.length > 0) {
                        actionPoint = new $JssorPoint$(touches[0].clientX, touches[0].clientY);
                    }
                } else {
                    actionPoint = $JssorUtils$.$GetMousePosition(event);
                }

                if (actionPoint) {
                    var distanceX = actionPoint.x - _DragStartMouseX;
                    var distanceY = actionPoint.y - _DragStartMouseY;

                    if (!_DragOrientation) {
                        if (_Options.$DragOrientation == 3) {
                            if (Math.abs(distanceX) >= Math.abs(distanceY)) {
                                _DragOrientation = 1;
                            }
                            else
                                _DragOrientation = 2;
                        }
                        else {
                            _DragOrientation = _Options.$DragOrientation;

                            if (_HandleTouchEventOnly && (Math.abs(distanceY) - Math.abs(distanceX)) * ((_DragOrientation == 1) ? 1 : -1) > 3) {
                                _DragOrientation = -1;
                            }
                        }

                        if (Math.floor(_DragStartPositionDisplay) != _DragStartPositionDisplay)
                            _DragOrientation = _Options.$PlayOrientation;
                    }

                    //if (distance > 0 && !_CurrentSlideIndex) {
                    //    distance = Math.sqrt(distance) * 5;
                    //}

                    //if (distance < 0 && _CurrentSlideIndex >= _SlideCount - 1) {
                    //    distance = -Math.sqrt(-distance) * 5;
                    //}

                    if (_DragOrientation == 1) {
                        _PositionToGoByDrag = _DragStartPositionDisplay - distanceX / _StepLengthX;
                        _DragOffset = distanceX;
                    }
                    else {
                        _PositionToGoByDrag = _DragStartPositionDisplay - distanceY / _StepLengthY;
                        _DragOffset = distanceY;
                    }

                    if (_DragOrientation > 0) {
                        $JssorUtils$.$CancelEvent(event);
                        if (!_IsSliderRunning)
                            _CarouselPlayer.$StandBy(_DragStartPositionDisplay);
                        else
                            _CarouselPlayer.$SetStandByPosition(_PositionToGoByDrag);
                    }
                }
            }

            function OnDragEnd(event) {

                if (_IsDragging) {
                    _LastTimeMoveByDrag = $JssorUtils$.$GetNow();

                    $JssorUtils$.$RemoveEvent(document, _MoveEvent, OnDragMove);

                    _LastDragSucceded = _DragOffset;

                    _CarouselPlayer.$Stop();

                    if (!_LastDragSucceded && _DragStart_CarouselPlaying) {
                        _CarouselPlayer.$Continue(_DragStartPlayToPosition);
                    }
                    else {
                        var currentIndex = _CurrentSlideIndex;
                        if (currentIndex == -1)
                            currentIndex = 0;

                        var currentPosition = _Carousel.$GetPosition();

                        var toPosition = currentIndex;

                        if (!_DragOffset)
                            toPosition = currentPosition;
                        else if (Math.abs(_DragOffset) >= _Options.$MinDragOffsetToSlide) {
                            toPosition = Math.floor(currentPosition);
                            if (_DragOffset < 0) {
                                toPosition += 1;
                            }
                        }

                        _CarouselPlayer.$PlayCarousel(currentPosition, toPosition, Math.abs(toPosition - currentPosition) * _SlideDuration);
                    }

                    _IsDragging = false;
                }
            }

            var _HidenSlideIndex;

            function HideSlideItemForSlideshow(index) {
                _HidenSlideIndex = index + 1;
                _SlideItems[index].$HideContentForSlideshow();
            }

            function UnhideSlideItem() {
                if (_HidenSlideIndex) {
                    _SlideItems[_HidenSlideIndex - 1].$UnhideContentForSlideshow();
                    _HidenSlideIndex = null;
                }
            }

            function GoTo(index, specifiedDuration, callback) {
                GoToLocal(index, callback, specifiedDuration);
            }

            function SetCurrentSlideIndex(index) {
                _PreviousSlideIndex = _CurrentSlideIndex;
                _CurrentSlideIndex = GetRealIndex(index);
                _PrevSlideItem = _SlideItems[_CurrentSlideIndex];
                ResetNavigator(_CurrentSlideIndex);
                return _CurrentSlideIndex;
            }

            function GoToLocal(index, callback, specifiedDuration) {
                if (_CarouselEnabled) {
                    _CarouselPlayer.$Stop();
                    _Slideshow.$UpdateLink();

                    {
                        //Slide Duration
                        var slideDuration = specifiedDuration;
                        if (!slideDuration)
                            slideDuration = _SlideDuration;

                        var currentSlideInfo = _Carousel.$GetCurrentSlideInfo();
                        if (currentSlideInfo.$Position || !IsCurrentSlideIndex(index)) {
                            var realIndex = GetRealIndex(index);
                            var onSlideAnimationCompleteCallback = $JssorUtils$.$CreateCallback(null, OnSlideAnimationComplete, realIndex, _SlideItems[realIndex], callback);
                            var positionDisplay = _Carousel.$GetPosition_Display();
                            var positionTo = index;
                            var duration = positionDisplay == positionTo ? 0 : slideDuration * Math.abs(positionTo - positionDisplay);
                            duration = Math.min(duration, _SlideDuration * _DisplayPieces * 1.5);

                            _CarouselPlayer.$PlayCarousel(positionDisplay, positionTo, duration, onSlideAnimationCompleteCallback);
                        }
                    }
                }
            }

            //Event handling end
            function ResetTimeToGo(timeToGo) {
                if (_IsActive) {
                    if (!_NotFirstRound) {
                        _NotFirstRound = true;
                        _TimeToGo = 0;
                    }
                    else
                        _TimeToGo = timeToGo || _AutoPlayInterval;
                }
                else
                    _TimeToGo = 600000000;
            }

            function OnPark(index, slideItem) {
                _DragOrientation = 0;
                var previousSlideIndex = _CurrentSlideIndex;
                if (IsCurrentSlideIndex(index)) {
                    if (_SlideshowRunner) {
                        ShowSlideshowPanel(IsPreviousSlideIndex(index) && _IsSlideshowFrozen && _SlideshowRunner.$Transition.$Outside);

                        _SlideshowRunner.$Unfreez();
                    }
                }
                else {
                    SetCurrentSlideIndex(index);

                    _Slideshow.$Clear();
                }

                _IsPreparingToGo = true;
                _IsSlideshowRunning = 0;
                _IsSlideshowFrozen = false;
                _Slideshow.$UpdateLink();

                _SlideItems[_CurrentSlideIndex].$OnAfterIn(function () {
                    ResetTimeToGo();
                    _IsPreparingToGo = false;
                });

                //Trigger EVENT_PARK
                self.$TriggerEvent(1, previousSlideIndex, _CurrentSlideIndex);
            }

            function OnSlideAnimationComplete(index, slideItem, callback) {
                if (callback)
                    callback();
            }

            function ResetNavigator(index, temp) {
                $JssorUtils$.$Each(_Navigators, function (navigator) {
                    navigator.$SetCurrentIndex(GetRealIndex(index), temp);
                });
            }

            function GoForNextSlide() {
                _IsPreparingToGo = false;

                if (_SlideshowEnabled) {
                    _IsSlideshowFrozen = false;
                    _IsSlideshowRunning = 1;

                    _Slideshow.$GoForSlideshow(GetRealIndex(_CurrentSlideIndex + 1));
                }
                else {
                    var indexToGo = _CurrentSlideIndex;
                    if (indexToGo == -1)
                        indexToGo = 0;
                    else
                        indexToGo += _AutoPlaySteps;

                    GoToLocal(indexToGo);
                }
            }

            function PrepareForNextSlide() {
                _IsPreparingToGo = true;

                if (_CurrentSlideIndex == -1)
                    GoForNextSlide();
                else {
                    _SlideItems[_CurrentSlideIndex].$OnBeforeOut(GoForNextSlide, _SlideshowEnabled);
                }
            }

            function Run() {
                if (_AutoPlay && _IsActive && !_IsDragging && !_IsSliderRunning && !_IsPreparingToGo && !_IsRequesting && (!_IsSlideshowRunning || _IsSlideshowFrozen) || _FirstRound) {
                    _TimeToGo -= 60;

                    if (_TimeToGo < 0 && (!_HoverToPause || _HoverStatus)) {
                        _FirstRound = false;

                        PrepareForNextSlide();
                    }
                }

                $JssorUtils$.$Delay(Run, 60);
            }

            function Carousel(slideItems) {
                var _Self = this;
                var _Count = slideItems.length;

                $JssorAnimator$.call(_Self, 0, 0, { $LoopLength: _Count });

                _Self.$Count = _Count;

                _Self.$GetCurrentSlideInfo = function () {
                    var positionDisplay = _Self.$GetPosition_Display();
                    var itemIndex = Math.floor(positionDisplay);

                    var slideIndex = slideItems[itemIndex].$Index;
                    var slidePosition = positionDisplay - Math.floor(positionDisplay);

                    return { $Index: slideIndex, $Position: slidePosition };
                };

                _Self.$OnPositionChange = function (oldPosition, newPosition) {
                    var index = Math.floor(newPosition);
                    if (index != newPosition && newPosition > oldPosition)
                        index++;

                    ResetNavigator(index, true);
                };

                //Carousel Constructor
                {
                    $JssorUtils$.$Each(slideItems, function (slideItem) {
                        slideItem.$SetLoopLength(_Count);
                        _Self.$Chain(slideItem);
                        slideItem.$Shift(_ParkingPosition / ((_Options.$PlayOrientation == 1) ? _StepLengthX : _StepLengthY));
                    });
                }
            }

            function Slideshow() {
                var _Self = this;
                var _SlideContainer1 = new SlideContainer();
                var _SlideContainer2 = new SlideContainer();
                var _Wrapper = CreatePanel();
                $JssorUtils$.$SetStyleOverflow(_Wrapper, "");
                var _SlideItem;
                var _CurrentLink;

                $JssorAnimator$.call(_Self, -1, 2, { $Easing: $JssorEasing$.$EaseLinear, $Setter: { $Position: SetPosition} }, _Wrapper, { $Position: 1 }, { $Position: -1 });

                function RunSlideshow(index, slideItem) {
                    if (_AutoPlay && _IsActive && !_IsDragging && !_IsSliderRunning && !_IsRequesting) {
                        _CurrentSlideIndex = GetRealIndex(index);
                        _SlideshowRunner.$Play();
                    }
                }

                function OnSlideshowStoppedCallback(index, slideItem) {
                    ShowSlideshowPanel();

                    _IsPreparingToGo = true;
                    _IsSlideshowFrozen = false;
                    _IsSlideshowRunning = 0;
                    UpdateLink();

                    slideItem.$OnAfterIn(function () {
                        ResetTimeToGo();
                        _IsPreparingToGo = false;
                    }, true);
                }

                function UpdateLink() {
                    if (!_LinkContainer) {
                        _LinkContainer = CreatePanel();
                        $JssorUtils$.$SetStyleBackgroundColor(_LinkContainer, "#000");
                        $JssorUtils$.$SetStyleOpacity(_LinkContainer, 0);
                        $JssorUtils$.$AppendChild(elmt, _LinkContainer);
                    }

                    var linkToShow = _SlideItem && _SlideItem.$Link;
                    var toHide = _ShowLink < 2 || !_IsSlideshowRunning || _IsSliderRunning || _IsDragging || !linkToShow;

                    $JssorUtils$.$ClearChildren(_LinkContainer);

                    if (!toHide) {
                        $JssorUtils$.$AppendChild(_LinkContainer, linkToShow);
                        _CurrentLink = linkToShow;
                    }

                    $JssorUtils$.$ShowElement(_LinkContainer, _IsSlideshowRunning == 1 || _IsSlideshowFrozen);
                }

                _Self.$Wrapper = _Wrapper;
                _Self.$GoForSlideshow = function (index) {
                    _SlideItem = _SlideItems[index];

                    //Move slideshow container to current slide position
                    var position = index;
                    _Self.$Locate(position, 1);
                    _Self.$GoToPosition(position);

                    //Prepare Slideshow Runner
                    var onSlideshowStoppedCallback = $JssorUtils$.$CreateCallback(null, OnSlideshowStoppedCallback, index, _SlideItem);

                    var transition = GetTransition();
                    _SlideshowRunner = new _SlideshowRunnerClass(_SlideContainer1, _SlideContainer2, _PrevSlideItem, _SlideItem, transition, _SlideWidth, _SlideHeight, _LoadingContainer, _SlideshowOptions, onSlideshowStoppedCallback);
                    _SlideshowRunner.$Initialize();
                    ShowSlideshowPanel(transition.$Outside);

                    //Hide the very slide and move board to correct position to reveal slideshow runner
                    _SlideItem.$HideContentForSlideshow();

                    _CarouselPlayer.$MoveCarouselTo(position);
                    SetCurrentSlideIndex(index);
                    UpdateLink();

                    _SlideItem.$LoadImage($JssorUtils$.$CreateCallback(null, RunSlideshow, index, _SlideItem));
                };

                _Self.$StopSlideshow = function () {
                    if (_SlideshowRunner) {
                        ShowSlideshowPanel();
                        _SlideshowRunner.$Freez();
                    }
                };

                _Self.$Clear = function () {
                    if (_SlideshowRunner) {
                        _SlideshowRunner.$Cancel();

                        _SlideContainer2.$Clear();

                        _SlideItem.$UnhideContentForSlideshow();
                    }
                };

                _Self.$UpdateLink = UpdateLink;

                //Slideshow Constructor
                {
                    ShowSlideshowPanel();

                    $JssorDebug$.$Execute(function () {
                        $JssorUtils$.$SetAttribute(_SlideContainer1.$Elmt, "id", "slide_container_1");
                        $JssorUtils$.$SetAttribute(_SlideContainer2.$Elmt, "id", "slide_container_2");
                    });

                    $JssorUtils$.$AppendChild(_Wrapper, _SlideContainer1.$Elmt);
                    $JssorUtils$.$AppendChild(_Wrapper, _SlideContainer2.$Elmt);
                }
            }

            function CarouselPlayer(carousel, slideshow) {
                var _Self = this;
                var _FromPosition;
                var _ToPosition;
                var _Duration;
                var _Conveyor;
                var _StandBy;
                var _StandByPosition;

                $JssorAnimator$.call(_Self, -100000000, 200000000);

                _Self.$OnStart = function () {
                    _IsSliderRunning = true;
                };

                _Self.$OnStop = function () {
                    _IsSliderRunning = false;
                    _StandBy = false;

                    var currentSlideInfo = carousel.$GetCurrentSlideInfo();

                    $JssorDebug$.$Execute(function () {
                        if (currentSlideInfo.$Index == 1) {
                            var a = 0;
                        }
                    });

                    if (currentSlideInfo.$Position == 0) {
                        OnPark(currentSlideInfo.$Index, _SlideItems[currentSlideInfo.$Index]);
                    }
                };

                _Self.$OnPositionChange = function (oldPosition, newPosition) {
                    var toPosition;

                    if (_StandBy)
                        toPosition = _StandByPosition;
                    else {
                        toPosition = _ToPosition;

                        if (_Duration)
                            toPosition = newPosition / _Duration * (_ToPosition - _FromPosition) + _FromPosition;
                    }

                    _Conveyor.$GoToPosition(toPosition);
                };

                _Self.$PlayCarousel = function (fromPosition, toPosition, duration, callback) {
                    $JssorDebug$.$Execute(function () {
                        if (_Self.$IsPlaying())
                            $JssorDebug$.$Fail("The carousel is already playing.");
                    });

                    _FromPosition = fromPosition;
                    _ToPosition = toPosition;
                    _Duration = duration;

                    _Self.$GoToPosition(0);
                    _Self.$PlayToPosition(duration, callback);
                };

                _Self.$StandBy = function (standByPosition) {
                    _StandBy = true;
                    _StandByPosition = standByPosition;
                    _Self.$Play(standByPosition, null, true);
                };

                _Self.$SetStandByPosition = function (standByPosition) {
                    _StandByPosition = standByPosition;
                };

                _Self.$MoveCarousel = function (offset) {
                    _Conveyor.$Move(offset);
                };

                _Self.$MoveCarouselTo = function (position) {
                    if (!_IsSliderRunning)
                        _Conveyor.$GoToPosition(position);
                };

                //CarouselPlayer Constructor
                {
                    _Conveyor = new $JssorAnimator$(-100000000, 200000000);

                    _Conveyor.$Combine(carousel);
                    _Conveyor.$Combine(slideshow);
                }
            }

            self.$GoToLocal = function (index, callback, specifiedDuration) {
                if (!_IsDragging && !IsCurrentSlideIndex(index)) {
                    if (_SlideshowRunner) {
                        ShowSlideshowPanel();
                        _SlideshowRunner.$Freez();
                    }

                    GoToLocal(index, callback, specifiedDuration);
                }
            };

            self.$StopSlideshow = function () {
                _Slideshow.$StopSlideshow();
            };

            self.$PlaySlideshow = function () {
                ResetTimeToGo(1);
            };

            self.$SlideItems = _SlideItems;

            //SlideBoard Constructor
            {
                $JssorDebug$.$Execute(function () {
                    //$JssorUtils$.$SetStyleBackgroundColor(elmt, "lightgray");
                });

                _Slideshow = new Slideshow();
                $JssorUtils$.$AppendChild(_SlideshowPanel, _Slideshow.$Wrapper);

                self.$Elmt = elmt;
                if (_Options.$PlayOrientation == 1) {
                    $JssorUtils$.$SetStyleWidth(elmt, _StepLengthX * _DisplayPieces - _SlideSpacing);
                }
                else {
                    $JssorUtils$.$SetStyleHeight(elmt, _StepLengthY * _DisplayPieces - _SlideSpacing);
                }
                $JssorUtils$.$SetStyleOverflow(elmt, "hidden");

                for (var i = 0; i < _SlideElmts.length; i++) {
                    var slideElmt = _SlideElmts[i];
                    var slideItem = new SlideItem(self, slideElmt, i);
                    slideItem.$CaptureLinkClick(LinkClickEventHandler);
                    $JssorUtils$.$AppendChild(elmt, slideItem.$Wrapper);
                    _SlideItems.push(slideItem);
                }

                _Carousel = new Carousel(_SlideItems)
                _CarouselPlayer = new CarouselPlayer(_Carousel, _Slideshow);
                _CarouselPlayer.$MoveCarouselTo(0);

                $JssorDebug$.$Execute(function () {
                    if (_LoadingContainer)
                        $JssorUtils$.$SetAttribute(_LoadingContainer, "id", "theloadingcontainer");
                });

                $JssorUtils$.$SetStyleCursor(elmt, "move");
                $JssorUtils$.$AppendChild(_SlidesContainer, elmt);

                if (_DragEnabled) {
                    if (window.navigator.msPointerEnabled) {
                        _HandleTouchEventOnly = true;

                        _DownEvent = "MSPointerDown";
                        _MoveEvent = "MSPointerMove";
                        _UpEvent = "MSPointerUp";
                        _CancelEvent = "MSPointerCancel";

                        if (_Options.$DragOrientation) {
                            var touchAction = "none";
                            if (_Options.$DragOrientation == 1) {
                                touchAction = "pan-y";
                            }
                            else if (_Options.$DragOrientation == 2) {
                                touchAction = "pan-x";
                            }

                            $JssorUtils$.$SetAttribute(elmt.style, "-ms-touch-action", touchAction);
                        }
                    }
                    else if ("ontouchstart" in window || "createTouch" in document) {
                        _HandleTouchEventOnly = true;

                        _DownEvent = "touchstart";
                        _MoveEvent = "touchmove";
                        _UpEvent = "touchend";
                        _CancelEvent = "touchcancel";
                    }

                    $JssorUtils$.$AddEvent(elmt, _DownEvent, OnMouseDown);
                    $JssorUtils$.$AddEvent(document, _UpEvent, OnDragEnd);
                    $JssorUtils$.$AddEvent(document, _CancelEvent, OnDragEnd);
                }

                _IsActive = true;

                if (_SlideshowEnabled)
                    Run();
                else
                    $JssorUtils$.$AddEvent(window, "load", Run);
            }
        } //SlideBoard

        $JssorDebug$.$Execute(function () {
            var outerContainerElmt = $JssorUtils$.$GetElement(elmt);
            if (!outerContainerElmt)
                $JssorDebug$.$Fail("Outer container '" + elmt + "' not found.");
        });

        var self = this;
        var elmt = $JssorUtils$.$GetElement(elmt);

        var _Options = $JssorUtils$.$Extend({
            $ShowLoading: false,            //[Optional] Show loading screen or not, default value is false
            $AutoPlay: false,               //[Optional] Whether to auto play, default value is false
            $AutoPlaySteps: 1,              //[Optional] Steps to go of every play (this options applys only when slideshow disabled), default value is 1
            $AutoPlayInterval: 3000,        //[Optional] Interval to play next slide since the previous stopped if a slideshow is auto playing, default value is 3000

            $SlideDuration: 400,            //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 400
            $MinDragOffsetToSlide: 20,      //[Optional] Minimum drag offset that trigger slide, default value is 20
            $SlideSpacing: 0, 				//[Optional] Space between each slide in pixels, default value is 0
            $DisplayPieces: 1,              //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), default value is 1
            $ParkingPosition: 0,            //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
            $UISearchMode: 1,               //[Optional] The way (0 parellel, 1 recursive, default value is recursive) to search UI components (slides container, loading screen, navigator container, direction navigator container, thumbnail navigator container etc.
            $PlayOrientation: 1,            //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, default value is 1
            $DragOrientation: 1             //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 both, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)

        }, options);

        //Sodo statement for development time intelligence only
        $JssorDebug$.$Execute(function () {
            _Options = $JssorUtils$.$Extend({
                $HoverToPause: undefined,
                $ArrowKeyNavigation: undefined,
                $SlideWidth: undefined,
                $SlideHeight: undefined,
                $SlideshowOptions: undefined,
                $CaptionSliderOptions: undefined,
                $NavigatorOptions: undefined,
                $DirectionNavigatorOptions: undefined,
                $ThumbnailNavigatorOptions: undefined
            },
            _Options);
        });

        var _SlideshowOptions = _Options.$SlideshowOptions;
        var _CaptionSliderOptions = $JssorUtils$.$Extend({ $Class: $JssorCaptionSliderBase$, $PlayInMode: 1, $PlayOutMode: 1 }, _Options.$CaptionSliderOptions);
        var _NavigatorOptions = _Options.$NavigatorOptions;
        var _DirectionNavigatorOptions = _Options.$DirectionNavigatorOptions;
        var _ThumbnailNavigatorOptions = _Options.$ThumbnailNavigatorOptions;

        $JssorDebug$.$Execute(function () {
            if (_SlideshowOptions && !_SlideshowOptions.$Class) {
                $JssorDebug$.$Fail("Option $SlideshowOptions error, class not specified.");
            }
        });

        $JssorDebug$.$Execute(function () {
            if (_Options.$CaptionSliderOptions && !_Options.$CaptionSliderOptions.$Class) {
                $JssorDebug$.$Fail("Option $CaptionSliderOptions error, class not specified.");
            }
        });

        $JssorDebug$.$Execute(function () {
            if (_NavigatorOptions && !_NavigatorOptions.$Class) {
                $JssorDebug$.$Fail("Option $NavigatorOptions error, class not specified.");
            }
        });

        $JssorDebug$.$Execute(function () {
            if (_DirectionNavigatorOptions && !_DirectionNavigatorOptions.$Class) {
                $JssorDebug$.$Fail("Option $DirectionNavigatorOptions error, class not specified.");
            }
        });

        $JssorDebug$.$Execute(function () {
            if (_ThumbnailNavigatorOptions && !_ThumbnailNavigatorOptions.$Class) {
                $JssorDebug$.$Fail("Option $DirectionNavigatorOptions error, class not specified.");
            }
        });

        var _UISearchMode = _Options.$UISearchMode;
        var _SlidesContainer = $JssorUtils$.$FindFirstChildByAttribute(elmt, "slides", null, _UISearchMode);
        var _LoadingContainer = $JssorUtils$.$FindFirstChildByAttribute(elmt, "loading", null, _UISearchMode);
        var _NavigatorContainer = $JssorUtils$.$FindFirstChildByAttribute(elmt, "navigator", null, _UISearchMode);
        var _ThumbnailNavigatorContainer = $JssorUtils$.$FindFirstChildByAttribute(elmt, "thumbnavigator", null, _UISearchMode);

        var _SlidesContainerWidth = $JssorUtils$.$GetStyleWidth(_SlidesContainer);
        var _SlidesContainerHeight = $JssorUtils$.$GetStyleHeight(_SlidesContainer);

        $JssorDebug$.$Execute(function () {
            if (isNaN(_SlidesContainerWidth))
                $JssorDebug$.$Fail("Width of slides container wrong specification, it should be specied by inline style in pixels (like style='width: 600px;').");

            if ($JssorUtils$.$IsUndefined(_SlidesContainerWidth))
                $JssorDebug$.$Fail("Width of slides container not specified, it should be specied by inline style in pixels (like style='width: 600px;').");

            if (isNaN(_SlidesContainerHeight))
                $JssorDebug$.$Fail("Height of slides container wrong specification, it should be specied by inline style in pixels (like style='height: 300px;').");

            if ($JssorUtils$.$IsUndefined(_SlidesContainerHeight))
                $JssorDebug$.$Fail("Height of slides container not specified, it should be specied by inline style in pixels (like style='height: 300px;').");

            var slidesContainerOverflow = $JssorUtils$.$GetStyleOverflow(_SlidesContainer);
            var slidesContainerOverflowX = $JssorUtils$.$GetStyleOverflowX(_SlidesContainer);
            var slidesContainerOverflowY = $JssorUtils$.$GetStyleOverflowY(_SlidesContainer);
            if (slidesContainerOverflow != "hidden" && (slidesContainerOverflowX != "hidden" || slidesContainerOverflowY != "hidden"))
                $JssorDebug$.$Fail("Overflow of slides container wrong specification, it should be specified as 'hidden' (style='overflow:hidden;').");

            var slidesContainerTop = $JssorUtils$.$GetStyleTop(_SlidesContainer);
            var slidesContainerLeft = $JssorUtils$.$GetStyleLeft(_SlidesContainer);

            if (isNaN(slidesContainerTop))
                $JssorDebug$.$Fail("Top of slides container wrong specification, it should be specied by inline style in pixels (like style='top: 0px;').");

            if ($JssorUtils$.$IsUndefined(slidesContainerTop))
                $JssorDebug$.$Fail("Top of slides container not specified, it should be specied by inline style in pixels (like style='top: 0px;').");

            if (isNaN(slidesContainerLeft))
                $JssorDebug$.$Fail("Left of slides container wrong specification, it should be specied by inline style in pixels (like style='left: 0px;').");

            if ($JssorUtils$.$IsUndefined(slidesContainerLeft))
                $JssorDebug$.$Fail("Left of slides container not specified, it should be specied by inline style in pixels (like style='left: 0px;').");
        });

        $JssorDebug$.$Execute(function () {
            if (!$JssorUtils$.$IsNumeric(_Options.$DisplayPieces))
                $JssorDebug$.$Fail("Option $DisplayPieces error, it should be a numeric value and greater than or equal to 1.");

            if (_Options.$DisplayPieces < 1)
                $JssorDebug$.$Fail("Option $DisplayPieces error, it should be greater than or equal to 1.");

            if (_Options.$DisplayPieces > 1 && _Options.$DragOrientation && _Options.$DragOrientation != _Options.$PlayOrientation)
                $JssorDebug$.$Fail("Option $DragOrientation error, it should be 0 or the same of $PlayOrientation when $DisplayPieces is greater than 1.");

            if (!$JssorUtils$.$IsNumeric(_Options.$ParkingPosition))
                $JssorDebug$.$Fail("Option $ParkingPosition error, it should be a numeric value.");

            if (_Options.$ParkingPosition && _Options.$DragOrientation && _Options.$DragOrientation != _Options.$PlayOrientation)
                $JssorDebug$.$Fail("Option $DragOrientation error, it should be 0 or the same of $PlayOrientation when $ParkingPosition is not equal to 0.");
        });

        if (_Options.$DisplayPieces > 1 || _Options.$ParkingPosition)
            _Options.$DragOrientation &= _Options.$PlayOrientation;

        var _StyleDef;

        var _SlideElmts = $JssorUtils$.$GetChildren(_SlidesContainer);

        //For debug
        var _SlideItemCreatedCount = 0;
        var _SlideItemReleasedCount = 0;

        var _NotFirstRound;
        var _PrevSlideItem;
        var _SlideCount = _SlideElmts.length;

        var _SlideWidth = _Options.$SlideWidth || _SlidesContainerWidth;
        var _SlideHeight = _Options.$SlideHeight || _SlidesContainerHeight;

        var _SlideSpacing = _Options.$SlideSpacing;
        var _StepLengthX = _SlideWidth + _SlideSpacing;
        var _StepLengthY = _SlideHeight + _SlideSpacing;
        var _StepLength = _SlideWidth + _SlideSpacing;
        var _DisplayPieces = _Options.$DisplayPieces;

        var _PreviousSlideIndex;
        var _CurrentSlideIndex = -1;

        var _SlideshowPanel;
        var _SlideBoard;
        var _CurrentBoardIndex = 0;
        var _DragOrientation;

        var _HandleTouchEventOnly;

        var _Navigators = [];
        var _Navigator;
        var _DirectionNavigator;
        var _ThumbnailNavigator;

        var _ShowLoading = _Options.$ShowLoading;
        var _ShowLink;

        var _FirstRound;
        var _AutoPlay;
        var _AutoPlaySteps;
        var _HoverToPause = _Options.$HoverToPause;
        var _AutoPlayInterval = _Options.$AutoPlayInterval;
        var _SlideDuration = _Options.$SlideDuration;

        var _SlideshowRunnerClass;
        var _TransitionsOrder;
        var _Transitions;

        var _SlideshowEnabled;
        var _ParkingPosition;
        var _CarouselEnabled = _DisplayPieces < _SlideCount;
        var _DragEnabled = _CarouselEnabled && _Options.$DragOrientation;
        var _LastDragSucceded;

        var _TransitionIndex = 0;
        var _HoverStatus = 1;   //0 Hovering, 1 Not hovering

        //SlideBoard variables begin
        var _IsActive;
        var _TimeToGo = 0;
        var _IsSlideshowRunning;
        var _IsSlideshowFrozen;

        //Variable Definition
        var _IsSliderRunning;
        //Request to Slide
        var _IsRequesting;
        var _IsPreparingToGo;
        var _IsDragging;

        //The X position of mouse/touch when a drag start
        var _DragStartMouseX = 0;
        //The Y position of mouse/touch when a drag start
        var _DragStartMouseY = 0;
        var _DragOffset;

        var _Carousel;
        var _Slideshow;
        var _CarouselPlayer;
        //SlideBoard variables end

        function CreatePanel() {
            var div = $JssorUtils$.$CreateDivElement();

            $JssorUtils$.$SetStyles(div, _StyleDef);
            $JssorUtils$.$SetStylePosition(div, "absolute");

            return div;
        }

        function GetRealIndex(index) {
            return (index % _SlideCount + _SlideCount) % _SlideCount;
        }

        function IsCurrentSlideIndex(index) {
            return GetRealIndex(index) == _CurrentSlideIndex;
        }

        function IsPreviousSlideIndex(index) {
            return GetRealIndex(index) == _PreviousSlideIndex;
        }

        function GoTo(index, callback, specifiedDuration) {
            var currentBoard = _SlideBoard;
            currentBoard.$GoToLocal(index, callback, specifiedDuration);
        }

        //Navigation Request Handler
        function NavigationClickHandler(index) {
            GoTo(index);
        }

        function ShowNavigators() {
            $JssorUtils$.$Each(_Navigators, function (navigator) {
                navigator.$Show(navigator.$Options.$ChanceToShow > _HoverStatus);
            });
        }

        function MainContainerMouseOutEventHandler(event) {
            event = $JssorUtils$.$GetEvent(event);
            // we have to watch out for a tricky case: a mouseout occurs on a
            // child element, but the mouse is still inside the parent element.
            // the mouseout event will bubble up to us. this happens in all
            // browsers, so we need to correct for this. technique from:
            // http://www.quirksmode.org/js/events_mouse.html
            var from = event.target ? event.target : event.srcElement;
            var to = event.relatedTarget ? event.relatedTarget : event.toElement;

            if (!$JssorUtils$.$IsChild(elmt, from) || $JssorUtils$.$IsChild(elmt, to)) {
                // the mouseout needs to start from this or a child node, and it
                // needs to end on this or an outer node.
                return;
            }

            _HoverStatus = 1;

            ShowNavigators();
        }

        function MainContainerMouseOverEventHandler() {
            _HoverStatus = 0;

            ShowNavigators();
        }

        function ShowSlideshowPanel(show) {
            $JssorUtils$.$SetStyleOverflow(_SlideshowPanel, show ? "" : "hidden");
        }

        function AdjustSlidesContainerSize() {
            _StyleDef = { $Width: _SlideWidth, $Height: _SlideHeight, $Top: 0, $Left: 0 };

            $JssorUtils$.$Each(_SlideElmts, function (slideElmt, i) {

                $JssorUtils$.$SetStyles(slideElmt, _StyleDef);
                $JssorUtils$.$SetStylePosition(slideElmt, "absolute");
                $JssorUtils$.$SetStyleOverflow(slideElmt, "hidden");

                $JssorUtils$.$HideElement(slideElmt);
            });

            if (_LoadingContainer) {
                $JssorUtils$.$SetStyles(_LoadingContainer, _StyleDef);
            }
        }

        self.$GoTo = GoTo;

        self.$Next = function (callback) {
            GoTo(_CurrentSlideIndex + 1, callback);
        };

        self.$Prev = function (callback) {
            GoTo(_CurrentSlideIndex - 1, callback);
        };

        self.$Stop = function () {
            _AutoPlay = false;
            _SlideBoard.$StopSlideshow();
        };

        var _PlayTicket;
        self.$Play = function (delay) {
            var ticket = _PlayTicket = $JssorUtils$.$GetNow();
            $JssorUtils$.$Delay(function () {
                if (ticket == _PlayTicket) {
                    _AutoPlay = true;
                    _SlideBoard.$PlaySlideshow();
                }
            }, delay || 0);
        };

        self.$SetSlideshowTransitions = function (transitions) {
            _Transitions = _Options.$Transitions = transitions;
            _PrototypeTransitions = [];
        };

        self.$SetCaptionTransitions = function (transitions) {
            if (_CaptionSliderOptions) {
                _CaptionSliderOptions.$CaptionTransitions = transitions;
                _CaptionSliderOptions.$Version = $JssorUtils$.$GetNow();
            }
        };

        self.$IsLastDragSucceded = function () {
            return _LastDragSucceded;
        };

        self.$Request = function () {
            _IsRequesting = !_IsSliderRunning && !_IsDragging && (!_HoverToPause || _HoverStatus);

            return _IsRequesting;
        };

        self.$Unrequest = function () {
            _IsRequesting = false;
        };

        self.$GetSlidesCount = function () {
            return _SlideElmts.length;
        };

        //$JssorSlideshow$ Constructor
        {

            _FirstRound = true;
            _AutoPlaySteps = _Options.$AutoPlaySteps;
            _AutoPlay = _Options.$AutoPlay;

            self.$Options = options;

            AdjustSlidesContainerSize();

            _SlideshowPanel = CreatePanel();
            $JssorUtils$.$SetStyleLeft(_SlideshowPanel, $JssorUtils$.$GetStyleLeft(_SlidesContainer));
            $JssorUtils$.$SetStyleTop(_SlideshowPanel, $JssorUtils$.$GetStyleTop(_SlidesContainer));
            $JssorUtils$.$InsertBefore($JssorUtils$.$GetParentNode(_SlidesContainer), _SlideshowPanel, _SlidesContainer);

            if (_SlideshowOptions) {
                _ShowLink = _SlideshowOptions.$ShowLink;
                _SlideshowRunnerClass = _SlideshowOptions.$Class;
                _TransitionsOrder = _SlideshowOptions.$TransitionsOrder;
                _Transitions = _SlideshowOptions.$Transitions;

                _SlideshowEnabled = _DisplayPieces == 1 && _SlideCount > 1 && _SlideshowRunnerClass && _AutoPlay;
            }

            _ParkingPosition = (_SlideshowEnabled || _DisplayPieces >= _SlideCount) ? 0 : _Options.$ParkingPosition;

            if (_LoadingContainer)
                $JssorUtils$.$ShowElement(_LoadingContainer, false);

            _SlideBoard = new SlideBoard();

            //Navigator
            if (_NavigatorContainer && _NavigatorOptions) {
                _Navigator = new _NavigatorOptions.$Class(_NavigatorContainer, _NavigatorOptions);
                _Navigators.push(_Navigator);
            }

            //Direction Arrows
            if (_DirectionNavigatorOptions) {
                _DirectionNavigator = new _DirectionNavigatorOptions.$Class(elmt, _DirectionNavigatorOptions);
                _Navigators.push(_DirectionNavigator);
            }

            //Thumbnail Navigator
            if (_ThumbnailNavigatorContainer && _ThumbnailNavigatorOptions) {
                _ThumbnailNavigator = new _ThumbnailNavigatorOptions.$Class(_ThumbnailNavigatorContainer, _ThumbnailNavigatorOptions);
                _Navigators.push(_ThumbnailNavigator);
            }

            $JssorUtils$.$Each(_Navigators, function (navigator) {
                navigator.$Reset(_SlideCount, _SlideBoard.$SlideItems, _LoadingContainer);
                navigator.$AddEventListener($JssorNavigatorEvents$.$NAVIGATIONREQUEST, NavigationClickHandler);
            });

            $JssorUtils$.$AddEvent(elmt, "mouseout", MainContainerMouseOutEventHandler);
            $JssorUtils$.$AddEvent(elmt, "mouseover", MainContainerMouseOverEventHandler);

            ShowNavigators();

            //Keyboard Navigation
            if (_Options.$ArrowKeyNavigation) {
                $JssorUtils$.$AddEvent(document, "keydown", function (e) {
                    if (e.keyCode == $JssorKeyCode$.$LEFT) {
                        //Arrow Left
                        GoTo(_CurrentSlideIndex - 1);
                    }
                    else if (e.keyCode == $JssorKeyCode$.$RIGHT) {
                        //Arrow Right
                        GoTo(_CurrentSlideIndex + 1);
                    }
                });
            }

            _SlideBoard.$PlaySlideshow();
        }
    }

    JssorSlider.$ASSEMBLY_BOTTOM_LEFT = ASSEMBLY_BOTTOM_LEFT;
    JssorSlider.$ASSEMBLY_BOTTOM_RIGHT = ASSEMBLY_BOTTOM_RIGHT;
    JssorSlider.$ASSEMBLY_TOP_LEFT = ASSEMBLY_TOP_LEFT;
    JssorSlider.$ASSEMBLY_TOP_RIGHT = ASSEMBLY_TOP_RIGHT;
    JssorSlider.$ASSEMBLY_LEFT_TOP = ASSEMBLY_LEFT_TOP;
    JssorSlider.$ASSEMBLY_LEFT_BOTTOM = ASSEMBLY_LEFT_BOTTOM;
    JssorSlider.$ASSEMBLY_RIGHT_TOP = ASSEMBLY_RIGHT_TOP;
    JssorSlider.$ASSEMBLY_RIGHT_BOTTOM = ASSEMBLY_RIGHT_BOTTOM;

    JssorSlider.$EVENT_PARK = 1;
    JssorSlider.$EVENT_DRAGSTART = 2;

    $JssorSlider$ = JssorSlider;
}