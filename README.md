Network Diagnostic Test Web Framework 
====================

NDT (Network Diagnostic Tool) is a client/server program that provides
network configuration and performance testing to end-users' desktop,
laptop, and mobile platforms. For more information about NDT, please see:

https://code.google.com/p/ndt/

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
not currently utilize ExternalFunction.

### External Calls

Function that calls a JS function through the ExternalInterface class if
it exists by the name specified in the parameter.

-   **allTestsCompleted**: Called to indicate that the NDT test has completed successfully without error. 
    -   arguments: `none`
    -   expects: `none`

-   **fatalErrorOccured**: Called to indicate that the NDT test has encountered a fatal error.
    -   arguments: `none`
    -   expects: `none`

-   **testStarted**: Called when the NDT test has initiated a test. 
    -   arguments:
        -   `test_type` - The test or submission initiated by the NDT client (string), 'ClientToServerThroughput', 'ServerToClientThroughput', 'Meta'.
    -   expects: `none`

-   **testCompleted**: Called when the NDT test has completed a test. 
    -   arguments:
        -   `test_type` - The test or submission completed by the NDT client (string).
        -   `test_failed` - Whether an error was encountered during the test (bool).
    -   expects: `none`

-   **appendErrors**: Called when the NDT test has encountered an error. 
    -   arguments:
        -   `error_message` - NDT test error message (string).
    -   expects: `none`

-   **appendDebugOutput**: Called when the NDT test has triggered a debugging event. 
    -   arguments:
        -   `debug_message` - NDT test debug message (string).
    -   expects: `none`

-   **resultsProcessed**: Called to indicate that the NDT test has parsed the measurements and produced results.
    -   arguments: `none`
    -   expects: `none`

-   **getNDTServer**: Specifics the Measurement Lab server that should be used to test against
    -   arguments: `none`
    -   expects: `server_hostname` *required* - FQDN for Measurement Lab server (string).

-   **getClientApplication**: Sets the client name of the NDT application (default: swf)
    -   arguments: `none`
    -   expects: `client_name` *required* - Name of client application (string).

-   **getNDTDescription**: Sets the text description of NDT displayed within the flash application's interface.
    -   arguments: `none` 
    -   expects: `client_description` *required* - Text of message to display (string).


### Callbacks

Functions that can be called through the Flash instance from Javascript
to start tests and access data, including diagnostic information and
processed results.

-   **run_test**: Initiates the NDT Test Suite.
    -   params: `none`
    -   returns: `none`

-   **get_status**: Returns the status of the NDT Test application.
    -   params: `none`
    -   returns: `string`: Current state of test.

-   **getDebugOutput**: Returns the debug logs of the NDT Test application.
    -   params: `none`
    -   returns: `string`: Messages kept in the debug log.

-   **get_diagnosis**: Returns the results logs of the NDT Test application.
    -   params: `none`
    -   returns: `string`: Results for NDT test (long result).

-   **get_errmsg**: Returns the error status of the NDT Test application.
    -   params: `none`
    -   returns: `string`: State information for NDT test, will return information even if the test in not in a defective state, such as "All tests completed OK."

-   **get_host**: Returns the FQDN of the Measurement Lab selected for testing.
    -   params: `none`
    -   returns: `string`: FQDN of M-Lab server.

-   **get_PcBuffSpdLimit**: 
    -   params: `none`
    -   returns: `string`:

-   **getNDTvar**: Returns NDT test data, including processed measurement results
    -   params: 
        -   `varName` *required* - NDT variable name (string).
    -   returns: `string`: Test result.

To Do
---------------------
* ServerToClientThroughput does not send testStarted (Callback startTested -> testStarted)