<!-- Head -->
	<head>
		
		<!-- Title -->
		<title>Carriage House</title>
		
		<!-- CSS -->
		<link rel = "stylesheet" type = "text/css" href = "index.css" />
		<link rel = "stylesheet" type = "text/css" href = "social-buttons.css" />
		
		<!-- Favicon -->
		<link rel = "shortcut icon" type = "image/x-icon" href = "images/favicon.ico">
		
		<!-- Javascript -->
		<script type="text/javascript" src="example.js"></script>
		
		<!-- JQUERY AND AJAX -->
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
		
	</head>
<!-- End Head -->

<script type="text/javascript">
    $(function() {
        var d=300;
        $('#navigation a').each(function(){
            var $this = $(this);
			//var r=Math.floor(Math.random()*41)-20;
			var r = 0;
            $this.css({'-moz-transform':'rotate('+r+'deg)','-webkit-transform':'rotate('+r+'deg)','transform':'rotate('+r+'deg)'});
            /*$('#content').css({'-moz-transform':'rotate('+r+'deg)','-webkit-transform':'rotate('+r+'deg)','transform':'rotate('+r+'deg)'});*/
            $this.stop().animate({
                'marginTop':'-70px'                       
            },d+=150);
        });
        $('#navigation > li').hover(
			function () {
				var $this = $(this);
				$('a',$this).stop().animate({
					'marginTop':'-40px'
				},200);
			},
			function () {
				var $this = $(this);
				$('a',$this).stop().animate({
					'marginTop':'-70px'
				},200);
			}
		).click(function(){
			var $this = $(this);
			var name = this.className;
			/*$('#content').animate({marginTop:-600}, 300,function(){
				var $this = $(this);
				var r=Math.floor(Math.random()*41)-20;
				$this.css({'-moz-transform':'rotate('+r+'deg)','-webkit-transform':'rotate('+r+'deg)','transform':'rotate('+r+'deg)'});
				$('#content div').hide();
				$('#'+name).show();	
				$this.animate({marginTop:-200}, 300); 
			})*/		 
		});
    });
</script>

<!-- Javascript -->
<script type="text/javascript">


</script>
<!-- End Javascript -->

<script src="js/Jssor.Slider.Min.js"></script>
<script>
    jssor_slider1_starter = function (containerId) {
        var options = {
        	$AutoPlay: true,
        };
        var jssor_slider1 = new $JssorSlider$(containerId, options);
    };
</script>