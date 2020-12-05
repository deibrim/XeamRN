"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.ChatHeader = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ChatHeader = /** @class */ (function (_super) {
    __extends(ChatHeader, _super);
    function ChatHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChatHeader.prototype.render = function () {
        var _a = this.props, channelName = _a.channelName, numUniqueUsers = _a.numUniqueUsers, handleSearchChange = _a.handleSearchChange, searchLoading = _a.searchLoading, searchTerm = _a.searchTerm;
        return (react_1["default"].createElement(react_native_1.View, { style: styles.header },
            react_1["default"].createElement(react_native_1.View, { style: styles.message },
                react_1["default"].createElement(react_native_1.Text, { style: __assign({}, styles.name_count) }, channelName),
                react_1["default"].createElement(react_native_1.Text, { style: __assign(__assign({}, styles.name_count), { fontSize: 14 }) }, numUniqueUsers)),
            react_1["default"].createElement(react_native_1.View, { style: styles.search },
                react_1["default"].createElement(react_native_1.TextInput, { style: styles.input, underlineColorAndroid: "transparent", placeholder: "Search Messages...", placeholderTextColor: "#000000", autoCapitalize: "none", onChangeText: handleSearchChange, value: searchTerm }))));
    };
    return ChatHeader;
}(react_1.Component));
exports.ChatHeader = ChatHeader;
var styles = react_native_1.StyleSheet.create({
    header: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "black"
    },
    message: {
        width: "60%"
    },
    message__other__view: {},
    name_count: {
        textTransform: "capitalize",
        fontSize: 18,
        fontWeight: "bold"
    },
    input: {
        paddingLeft: 6,
        height: 35,
        borderBottomColor: "#000000",
        borderBottomWidth: 1
    }
});
exports["default"] = ChatHeader;
