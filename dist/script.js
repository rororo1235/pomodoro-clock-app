const MAX_BREAK = 60;
const MAX_SESSION = 60;
const DEFAULT_BREAK = 5;
const DEFAULT_SESSION = 25;
const MIN_BREAK_SESSION = 1;
const VALUE_CONTROL_UP = "up";
const VALUE_CONTROL_DOWN = "down";
const VALUE_CONTROL_PLAY = "play";
const VALUE_CONTROL_PAUSE = "pause";
const BREAK_LABEL = "Break Len";
const SESSION_LABEL = "Session Len";
const TIMER_LABEL_BREAK = "BREAK";
const TIMER_LABEL_SESSION = "SESSION";
const ONE_SECOND = 1000;
//const ONE_SECOND = 100;
const SECOND_PER_MINUTE = 60;
const AUDIO_BEEP = "http://peter-weinberg.com/files/1014/8073/6015/BeepSound.wav";
const MY_TEXT = "From Hanoi with <3";

const numberToDisplay = number => number > 9 ? "" + number : "0" + number;

const Footer = () => {
  return React.createElement("div", { id: "text" }, MY_TEXT);
};

const AudioBeep = props => {
  return React.createElement("audio", { id: "beep", ref: props.refer, src: AUDIO_BEEP, preload: "auto" });
};

const PomodoroDraws = () => {
  return React.createElement(React.Fragment, null, React.createElement("div", { id: "body" }), React.createElement("div", { id: "leaf" }));
};

const BreakControl = props => {
  return (
    React.createElement("div", { id: "break-control" },
    React.createElement("div", { id: "break-label" }, BREAK_LABEL),
    React.createElement("button", { className: "button", id: "break-decrement", onClick: props.handleChangeDown },
    React.createElement("i", { className: "fa fa-arrow-left" })),

    React.createElement("button", { className: "button", id: "break-increment", onClick: props.handleChangeUp },
    React.createElement("i", { className: "fa fa-arrow-right" }))));



};

const SessionControl = props => {
  return (
    React.createElement("div", { id: "session-control" },
    React.createElement("div", { id: "session-label" }, SESSION_LABEL),
    React.createElement("button", { className: "button", id: "session-decrement", onClick: props.handleChangeDown },
    React.createElement("i", { className: "fa fa-arrow-left" })),

    React.createElement("button", { className: "button", id: "session-increment", onClick: props.handleChangeUp },
    React.createElement("i", { className: "fa fa-arrow-right" }))));



};

const ScreenControl = props => {
  return (
    React.createElement("div", { className: "number-control" },
    React.createElement("div", { id: "break-length" }, props.breakNumber),
    React.createElement("div", { id: "session-length" }, props.sessionNumber)));


};

const ButtonControl = props => {
  return (
    React.createElement("div", { className: "button-control" },
    React.createElement("button", { className: "button", id: "start_stop", onClick: props.handlePlayOrPause },
    React.createElement("i", { className: "fa fa-play" }), " / ", React.createElement("i", { className: "fa fa-pause" })),

    React.createElement("button", { className: "button", id: "reset", onClick: props.handleReset },
    React.createElement("i", { className: "fa fa-refresh" }))));



};

const TimeScreen = props => {
  return (
    React.createElement("div", { className: "time-screen" },
    React.createElement("span", { id: "timer-label", className: props.isTimeOut ? "timeout" : "" }, props.timerLabel),
    React.createElement("span", { id: "time-left" }, numberToDisplay(props.minute), ":", numberToDisplay(props.second))));


};

class PomodoroClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLen: DEFAULT_BREAK,
      sessionLen: DEFAULT_SESSION,
      minuteNumber: DEFAULT_SESSION,
      secondNumber: 0,
      isTimerLabelSession: true,
      intervalFunction: null,
      isGoingToRunOutOfTime: false };


    this.handleChangeBreakLen = this.handleChangeBreakLen.bind(this);
    this.handleChangeSessionLen = this.handleChangeSessionLen.bind(this);
    this.handlePlayOrPause = this.handlePlayOrPause.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.countDownTime = this.countDownTime.bind(this);

    this.beepRef = React.createRef();
    this.playBeep = this.playBeep.bind(this);
  }

  handleChangeBreakLen(valueControl) {
    var breakLen = this.state.breakLen;
    if (this.state.intervalFunction == null) {
      switch (valueControl) {
        case VALUE_CONTROL_UP:
          if (breakLen < MAX_BREAK) {
            if (this.state.isTimerLabelSession) {
              this.setState({ breakLen: breakLen + 1 });
            } else {
              this.setState({
                breakLen: breakLen + 1,
                minuteNumber: breakLen + 1,
                secondNumber: 0 });

            }
          }
          break;
        case VALUE_CONTROL_DOWN:
          if (breakLen > MIN_BREAK_SESSION) {
            if (this.state.isTimerLabelSession) {
              this.setState({ breakLen: breakLen - 1 });
            } else {
              this.setState({
                breakLen: breakLen - 1,
                minuteNumber: breakLen + 1,
                secondNumber: 0 });

            }
          }
          break;}

    }
  }

  handleChangeSessionLen(valueControl) {
    var sessionLen = this.state.sessionLen;
    if (this.state.intervalFunction == null) {
      switch (valueControl) {
        case VALUE_CONTROL_UP:
          if (sessionLen < MAX_SESSION) {
            if (this.state.isTimerLabelSession) {
              this.setState({
                sessionLen: sessionLen + 1,
                minuteNumber: sessionLen + 1,
                secondNumber: 0 });

            } else {
              this.setState({ sessionLen: sessionLen + 1 });
            }
          }
          break;
        case VALUE_CONTROL_DOWN:
          if (sessionLen > MIN_BREAK_SESSION) {
            if (this.state.isTimerLabelSession) {
              this.setState({
                sessionLen: sessionLen - 1,
                minuteNumber: sessionLen - 1,
                secondNumber: 0 });

            } else {
              this.setState({ sessionLen: sessionLen - 1 });
            }
          }
          break;}

    }
  }

  handlePlayOrPause() {
    //Pause
    if (this.state.intervalFunction != null) {
      clearInterval(this.state.intervalFunction);
      this.setState({ intervalFunction: null });
    } else {
      //Play
      this.setState({ intervalFunction: setInterval(this.countDownTime, ONE_SECOND) });
    }
  }

  handleReset() {
    //beep
    this.beepRef.current.pause();
    this.beepRef.current.currentTime = 0;

    var newState = {};
    if (this.state.intervalFunction != null) {
      clearInterval(this.state.intervalFunction);
      newState.intervalFunction = null;
    }
    newState.isTimerLabelSession = true;
    newState.minuteNumber = DEFAULT_SESSION;
    newState.secondNumber = 0;
    newState.breakLen = DEFAULT_BREAK;
    newState.sessionLen = DEFAULT_SESSION;
    newState.isGoingToRunOutOfTime = false;
    this.setState(newState);
  }

  countDownTime() {
    var second = this.state.secondNumber;
    if (second > 0)
    this.setState({ secondNumber: second - 1 });else
    {
      var minute = this.state.minuteNumber;
      if (minute != 0) {
        this.setState({
          secondNumber: SECOND_PER_MINUTE - 1,
          minuteNumber: minute - 1,
          isGoingToRunOutOfTime: minute == 1 ? true : false });

      } else {
        var isTimerLabelSession = this.state.isTimerLabelSession;
        this.playBeep();
        this.setState({
          isTimerLabelSession: !isTimerLabelSession,
          minuteNumber: !isTimerLabelSession ? this.state.sessionLen : this.state.breakLen,
          secondNumber: 0,
          isGoingToRunOutOfTime: false });

      }
    }
  }

  playBeep() {
    this.beepRef.current.play();
  }

  render() {
    return (
      React.createElement(React.Fragment, null, React.createElement("div", { id: "pomodoro" },
      React.createElement(AudioBeep, { refer: this.beepRef }),
      React.createElement(PomodoroDraws, null),
      React.createElement("div", { className: "control" },
      React.createElement(BreakControl, { handleChangeUp: e => this.handleChangeBreakLen(VALUE_CONTROL_UP),
        handleChangeDown: e => this.handleChangeBreakLen(VALUE_CONTROL_DOWN) }),
      React.createElement(SessionControl, { handleChangeUp: e => this.handleChangeSessionLen(VALUE_CONTROL_UP),
        handleChangeDown: e => this.handleChangeSessionLen(VALUE_CONTROL_DOWN) })),


      React.createElement("div", { id: "screen" },
      React.createElement(ScreenControl, { sessionNumber: this.state.sessionLen, breakNumber: this.state.breakLen }),
      React.createElement(TimeScreen, { timerLabel: this.state.isTimerLabelSession ? TIMER_LABEL_SESSION : TIMER_LABEL_BREAK,
        minute: this.state.minuteNumber, second: this.state.secondNumber, isTimeOut: this.state.isGoingToRunOutOfTime })),

      React.createElement(ButtonControl, { handlePlayOrPause: this.handlePlayOrPause, handleReset: this.handleReset })),

      React.createElement(Footer, null)));


  }}



ReactDOM.render(React.createElement(PomodoroClock, null), document.getElementById("root"));