var width = 500,
	height = 400,
	twoPi = 2 * Math.PI;

var arc = d3.svg.arc()
	.startAngle(0)
	.endAngle(0)
	.innerRadius(140)
	.outerRadius(180);

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var meter = svg.append("g")
	.attr("class", "progress-meter");

meter.append("path")
	.attr("class", "background")
	.attr("d", arc.endAngle(twoPi));

var test_status = meter.append("text")
	.attr("text-anchor", "middle")
	.attr("dy", "0em")
	.text("Start Test")

var test_results = meter.append("text")
	.attr("class", "test_results")
	.attr("text-anchor", "middle")
	.attr("dy", "1.55em")


var foreground = meter.append("path")
	.attr("class", "foreground");

var time_switched = null,
	global_status = false;


	
var ndt_status_labels = {
							'notStarted': 'Preparing',
							'done': 'Complete',
							'runningInboundTest': 'Measuring Download',
							'runningOutboundTest': 'Measuring Upload',
							'sendingMetaInformation': 'Sending to M-Lab!'
						}

function ndt_on_change(returned_message) {

		test_status.text(ndt_status_labels[returned_message])
		var time_switched = new Date().getTime();
		
		if (returned_message == "runningInboundTest" || returned_message == "runningOutboundTest") {
			var time_in_progress = new Date().getTime() - time_switched;

			origin = 0
			progress = twoPi * (time_in_progress/10000)
		
			if (returned_message == "runningOutboundTest") {
				progress = twoPi + -1 * progress					
			}
			origin_angle = arc.endAngle(progress);
			foreground.attr("d", origin_angle);
		}
}
function ndt_on_completion() {
	test_results.text(NDT.get_result('download'));
}
