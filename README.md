Network Diagnostic Test Web Framework 
====================

NDT (Network Diagnostic Tool) is a client/server program that provides
network configuration and performance testing to end-users' desktop,
laptop, and mobile platforms. For more information about NDT, please see:

https://code.google.com/p/ndt/.

Partners within the Measurement Lab consortium have developed an NDT
client for browser-based testing of network conditions. While the latest
tested client is available within this repository as 'ndt.swf', the
source is available at: 
https://code.google.com/p/ndt/source/browse/#svn%2Ftrunk%2Fflash-client

Method 1: Javascript Interaction 
---------------------

Included in this repository is a Javascript file

Method 2: Flash Interaction 
---------------------

Alternatively, the Flash application allows interaction with external
code through Javscript, which can be used to control the NDT test. The
included Javascript in an implementation that calls in one way and does
not currently utilize ExternalFunction


### External Calls

* Function that calls a JS function through the ExternalInterface class if
* it exists by the name specified in the parameter.


(NDT Object).fatalErrorOccured
(NDT Object).allTestsCompleted
.testStarted
	param test_type String
.testCompleted
	param test_type String
	param test_failed bool
.appendErrors
	param error_message String
.appendDebugOutput
	param debug_message String
.resultsProcessed
.getNDTServer
getClientApplication
	client_application field
getNDTDescription
	NDT description

### Callbacks

Functions that can be called through the Flash instance from Javascript
to start tests and access data, including diagnostic information and
processed results.

"run_test", NDTPController.getInstance().startNDTTest);
"get_status", 
	return TestResults.getTestStatus string
"getDebugOutput", 
	retunr TestResults.getDebugMsg string
"get_diagnosis"
	return TestResults.getResultDetails string
"get_errmsg"
	return TestResults.getErrStatus string
"get_host", Main.getHost);
"get_PcBuffSpdLimit", TestResults.getPcLimit);
"getNDTvar", TestResultsUtils.getNDTVariable);

To Do
---------------------
* ServerToClientThroughput does not send testStarted (Callback startTested -> testStarted)

