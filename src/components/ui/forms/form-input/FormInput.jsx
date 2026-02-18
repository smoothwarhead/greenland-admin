import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, Power1 } from "gsap";
import "./form-input.scss";

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const PASSWORD_FIELDS = new Set([
  "password",
  "newPassword",
  "currentPassword",
  "confirmNewPassword",
]);

const FormInput = (props) => {
  const {
    cName = "",
    error = false, // parent can force error state
    inputType = "text",
    values = {}, // used for confirmNewPassword
    validate = true,
    errorMessage = "This field is required",
    isPassword = false,
    icon = null,
    handleChange,
    ...inputProps
  } = props;

  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // password constraints state
  const [lowerPassed, setLowerPassed] = useState(false);
  const [numPassed, setNumPassed] = useState(false);
  const [upperPassed, setUpperPassed] = useState(false);
  const [lengthPassed, setLengthPassed] = useState(false);

  const [pwdMatch, setPwdMatch] = useState(true);

  const conRef = useRef(null);
  const tl = useRef(null);

  // Ensure input is controlled to avoid React warnings
  const value = inputProps.value ?? "";

  const isEmpty = value === "";
  const isEmailField = inputProps.name === "email";

  const emailValid = useMemo(() => {
    if (!isEmailField) return true;
    if (isEmpty) return false;
    return EMAIL_REGEX.test(value);
  }, [isEmailField, isEmpty, value]);

  const shouldValidateNow = validate && touched;
  const requiredInvalid = shouldValidateNow && isEmpty;
  const emailInvalid = shouldValidateNow && isEmailField && !emailValid;

  // show base error if required invalid or email invalid or parent error
  const showBaseError =
    validate && (requiredInvalid || emailInvalid || (error && isEmpty));

  // Password constraints should run only for password fields
  const isPasswordField = isPassword || PASSWORD_FIELDS.has(inputProps.name);

  const consPassed = useMemo(() => {
    return lowerPassed && numPassed && upperPassed && lengthPassed;
  }, [lowerPassed, numPassed, upperPassed, lengthPassed]);

  // ---- Password constraints evaluation ----
  useEffect(() => {
    if (!isPasswordField) return;

    const val = String(value);

    setLowerPassed(/[a-z]/.test(val));
    setUpperPassed(/[A-Z]/.test(val));
    setNumPassed(/[0-9]/.test(val));
    setLengthPassed(val.length >= 6);
  }, [isPasswordField, value]);

  // ---- Confirm password match (only when field is confirmNewPassword) ----
  useEffect(() => {
    if (inputProps.name !== "confirmNewPassword") return;

    const base = values?.newPassword ?? "";
    const confirm = String(value);

    // if user hasn't started typing, don't show mismatch
    if (!confirm) {
      setPwdMatch(true);
      return;
    }

    setPwdMatch(confirm === base);
  }, [inputProps.name, value, values]);

  // ---- GSAP timeline init for password constraints panel ----
  useEffect(() => {
    if (!isPasswordField) return;

    if (!conRef.current) return;

    tl.current = gsap.timeline({ paused: true });

    tl.current.to(conRef.current, {
      display: "flex",
      top: 0,
      duration: 0.5,
      ease: Power1.easeInOut,
    });

    return () => {
      // cleanup on unmount
      if (tl.current) {
        tl.current.kill();
        tl.current = null;
      }
    };
  }, [isPasswordField]);

  // ---- play/reverse the password constraints panel ----
  useEffect(() => {
    if (!isPasswordField) return;
    if (!tl.current) return;

    // show constraints if focused OR user typed a password and it's not passing
    const hasTyped = value !== "";
    const shouldShow = isFocused || (hasTyped && !consPassed);

    if (shouldShow) tl.current.play();
    else tl.current.reverse();
  }, [isPasswordField, isFocused, consPassed, value]);

  // ---- Handlers ----
  const onBlur = (e) => {
    setTouched(true);
    setIsFocused(false);
    inputProps.onBlur?.(e);
  };

  const onFocus = (e) => {
    setIsFocused(true);
    inputProps.onFocus?.(e);
  };

  // Password-specific errors (only show after touch)
  const showPasswordRulesError =
    validate &&
    touched &&
    isPasswordField &&
    value !== "" &&
    !consPassed &&
    pwdMatch;

  const showConfirmMismatchError =
    validate &&
    touched &&
    inputProps.name === "confirmNewPassword" &&
    !pwdMatch;

  return (
    <div className="inp-control">
      {inputProps.label ? (
        <label
          className={`inp-lbl ${
            showBaseError || showPasswordRulesError || showConfirmMismatchError
              ? "lbl-error"
              : ""
          }`}
        >
          {inputProps.label}
          {inputProps.hint ? (
            <span className="inp-hint">{`Hint: ${inputProps.hint}`}</span>
          ) : null}
        </label>
      ) : null}

      <input
        {...inputProps}
        value={value}
        type={inputType}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        className={`${cName} ${
          showBaseError || showPasswordRulesError || showConfirmMismatchError
            ? "inp-error"
            : ""
        }`}
        aria-invalid={
          showBaseError || showPasswordRulesError || showConfirmMismatchError
        }
      />

      {/* base errors */}
      {showBaseError ? (
        <span className="inp-error-msg">{errorMessage}</span>
      ) : null}

      {/* password toggle icon slot (you control click outside) */}
      {isPassword ? (
        <span
          className={`password-toggle ${inputProps.label ? "haslbl" : "nolbl"}`}
        >
          {icon}
        </span>
      ) : null}

      {/* password rule error */}
      {showPasswordRulesError ? (
        <span className="inp-error-msg">
          Please enter a valid password. Follow the hint below.
        </span>
      ) : null}

      {/* confirm mismatch error */}
      {showConfirmMismatchError ? (
        <span className="inp-error-msg">{errorMessage}</span>
      ) : null}

      {/* password constraints list */}
      {isPasswordField ? (
        <div className="password-cons" ref={conRef}>
          <span className={lowerPassed ? "pwd-cons passed" : "pwd-cons"}>
            1 lowercase character
          </span>
          <span className={numPassed ? "pwd-cons passed" : "pwd-cons"}>
            1 number
          </span>
          <span className={upperPassed ? "pwd-cons passed" : "pwd-cons"}>
            1 uppercase character
          </span>
          <span className={lengthPassed ? "pwd-cons passed" : "pwd-cons"}>
            6 character minimum
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default FormInput;
