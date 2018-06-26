var LoadStatus;
(function (LoadStatus) {
    LoadStatus[LoadStatus["IDLE"] = 0] = "IDLE";
    LoadStatus[LoadStatus["LOAD"] = 1] = "LOAD";
    LoadStatus[LoadStatus["LOADED"] = 2] = "LOADED";
})(LoadStatus || (LoadStatus = {}));
export default LoadStatus;
