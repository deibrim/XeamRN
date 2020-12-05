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
exports.ChatForm = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var react_native_1 = require("react-native");
var firebase_utils_1 = require("../firebase/firebase.utils");
var ChatForm = /** @class */ (function (_super) {
    __extends(ChatForm, _super);
    function ChatForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            message: "",
            loading: false,
            errors: [],
            channel: _this.props.currentChannel,
            user: _this.props.currentUser,
            storageRef: firebase_utils_1["default"].storage().ref(),
            messagesRef: firebase_utils_1["default"].database().ref("messages")
        };
        _this.handleChange = function (event) {
            _this.setState({ message: event.target.value });
        };
        _this.createMessage = function () {
            var message = {
                timestamp: firebase_utils_1["default"].database.ServerValue.TIMESTAMP,
                user: {
                    id: _this.props.currentUser.id,
                    name: _this.props.currentUser.name,
                    avatar: _this.props.currentUser.profile_pic
                        ? _this.props.currentUser.profile_pic
                        : ""
                }
            };
            message["content"] = _this.state.message;
            return message;
        };
        _this.sendMessage = function (e) {
            var createMessage = _this.createMessage;
            var _a = _this.state, message = _a.message, messagesRef = _a.messagesRef;
            if (message) {
                _this.setState({ loading: true });
                messagesRef
                    .child(_this.props.currentChannel)
                    .push()
                    .set(createMessage())
                    .then(function () {
                    _this.setState({ loading: false, message: "", errors: [] });
                })["catch"](function (err) {
                    var errors = _this.state.errors.concat(err);
                    _this.setState({ loading: false, errors: errors });
                });
            }
            else {
                var errors = _this.state.errors.concat({ message: "Add a message" });
                _this.setState({ errors: errors });
            }
        };
        return _this;
    }
    ChatForm.prototype.render = function () {
        var _this = this;
        var _a = this.state, errors = _a.errors, message = _a.message, loading = _a.loading;
        var _b = this, handleChange = _b.handleChange, sendMessage = _b.sendMessage;
        return (react_1["default"].createElement(react_native_1.View, { style: styles.message__form },
            react_1["default"].createElement(react_native_1.TextInput, { style: styles.input, underlineColorAndroid: "transparent", placeholder: "Write your message...", placeholderTextColor: "#000000", autoCapitalize: "none", onChangeText: function (e) { return _this.setState({ message: e }); }, value: message }),
            react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: sendMessage, style: __assign({}, styles.appButtonContainer) },
                !loading && react_1["default"].createElement(react_native_1.Text, { style: __assign({}, styles.appButtonText) }, "Send"),
                loading && (react_1["default"].createElement(react_native_1.Image, { style: { marginLeft: 5, width: 20, height: 20 }, source: require("../assets/loader.gif") })))));
    };
    return ChatForm;
}(react_1.Component));
exports.ChatForm = ChatForm;
var styles = react_native_1.StyleSheet.create({
    message__form: {
        marginTop: "auto",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20
    },
    input: {
        width: "80%",
        // margin: 15,
        paddingLeft: 6,
        height: 40,
        borderBottomColor: "#000000",
        borderBottomWidth: 1
    },
    appButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        elevation: 8,
        backgroundColor: "#000000",
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 8,
        width: 45,
        height: 45
    },
    appButtonText: {
        fontSize: 10,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    }
});
var mapPropsToProps = function (state) { return ({
    currentChannel: state.chat.currentChannel,
    currentUser: state.user.currentUser
}); };
exports["default"] = react_redux_1.connect(mapPropsToProps)(ChatForm);
