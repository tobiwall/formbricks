import { BackButton } from "@/components/buttons/back-button";
import { SubmitButton } from "@/components/buttons/submit-button";
import { Headline } from "@/components/general/headline";
import { Input } from "@/components/general/input";
import { QuestionMedia } from "@/components/general/question-media";
import { Subheader } from "@/components/general/subheader";
import { ScrollableContainer } from "@/components/wrappers/scrollable-container";
import { getUpdatedTtc, useTtc } from "@/lib/ttc";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { getLocalizedValue } from "@formbricks/lib/i18n/utils";
import CountrySelector from '../country-selector/CountrySelector';
import CountryDropdown from '../country-selector/CountryDropdown';
import { type TResponseData, type TResponseTtc } from "@formbricks/types/responses";
import type { TSurveyContactInfoQuestion, TSurveyQuestionId } from "@formbricks/types/surveys/types";

interface ContactInfoQuestionProps {
  question: TSurveyContactInfoQuestion;
  value?: string[];
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  autoFocus?: boolean;
  languageCode: string;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
  currentQuestionId: TSurveyQuestionId;
  autoFocusEnabled: boolean;
}

export function ContactInfoQuestion({
  question,
  value,
  onChange,
  onSubmit,
  onBack,
  isFirstQuestion,
  isLastQuestion,
  languageCode,
  ttc,
  setTtc,
  currentQuestionId,
  autoFocusEnabled,
}: ContactInfoQuestionProps) {
  const [startTime, setStartTime] = useState(performance.now());

  // Countryselector dropdown for phonenumber
  const [countryCode, setCountryCode] = useState('click...');
  const [code, setCode] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const handleCountryCodeChange = (newCountryFlag: String, newCountryCode: string) => { setCountryCode(newCountryFlag + " " + newCountryCode); setCode(newCountryCode); };
  const toggleDropdown = () => {
    setShowCountryDropdown(!showCountryDropdown);
    const phoneField = document.getElementById("inputPhone") as HTMLInputElement;
    if (phoneField && showCountryDropdown) {
      phoneField.focus();
    }
  };

  const isMediaAvailable = question.imageUrl || question.videoUrl;
  const formRef = useRef<HTMLFormElement>(null);
  useTtc(question.id, ttc, setTtc, startTime, setStartTime, question.id === currentQuestionId);
  const isCurrent = question.id === currentQuestionId;
  const safeValue = useMemo(() => {
    return Array.isArray(value) ? value : ["", "", "", "", ""];
  }, [value]);

  const fields = [
    {
      id: "firstName",
      ...question.firstName,
      placeholder: question.firstName.placeholder[languageCode],
    },
    {
      id: "lastName",
      ...question.lastName,
      placeholder: question.lastName.placeholder[languageCode],
    },
    {
      id: "email",
      ...question.email,
      placeholder: question.email.placeholder[languageCode],
    },
    {
      id: "phone",
      ...question.phone,
      placeholder: question.phone.placeholder[languageCode],
    },
    {
      id: "company",
      ...question.company,
      placeholder: question.company.placeholder[languageCode],
    },
  ];

  const handleChange = (fieldId: string, fieldValue: string) => {
    const newValue = fields.map((field) => {
      if (field.id === fieldId) {
        return fieldValue;
      }
      const existingValue = safeValue[fields.findIndex((f) => f.id === field.id)] || "";
      return field.show ? existingValue : "";
    });
    onChange({ [question.id]: newValue });
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const updatedTtc = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
    setTtc(updatedTtc);
    let containsAllEmptyStrings = safeValue.length === 5 && safeValue.every((item) => item.trim() === "");
    const finalValues = safeValue.map((value, index) => {
      const field = fields[index];
      if (field.id === "phone") {
        return code + " " + value;
      }
      return value;
    });
    if (containsAllEmptyStrings) {
      onSubmit({ [question.id]: [] }, updatedTtc);
    } else {
      onSubmit({ [question.id]: finalValues }, updatedTtc);
    }
  };

  const contactInfoRef = useCallback(
    (currentElement: HTMLInputElement | null) => {
      // will focus on current element when the question ID matches the current question
      if (question.id && currentElement && autoFocusEnabled && question.id === currentQuestionId) {
        currentElement.focus();
      }
    },
    [question.id, autoFocusEnabled, currentQuestionId]
  );

  // useEffect onclick outside the dropdown for closing dropdown
  // focus on phone-input after selecting a country
  useEffect(() => {
    if (!showCountryDropdown) return;
    const dropdownContainer = document.getElementById("dropdownContainer");
    const dropdownButton = document.getElementById("dropdownButton");

    const handleClickOutside = (event: MouseEvent) => {
      const isClickInsideDropdown =
        dropdownContainer?.contains(event.target as Node) ||
        dropdownButton?.contains(event.target as Node);
      if (!isClickInsideDropdown) { setShowCountryDropdown(false); }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const phoneField = document.getElementById("inputPhone") as HTMLInputElement;
        if (phoneField) { phoneField.focus(); }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showCountryDropdown]);

  return (
    <form key={question.id} onSubmit={handleSubmit} className="fb-w-full" ref={formRef}>
      <ScrollableContainer>
        <div>
          {isMediaAvailable ? (
            <QuestionMedia imgUrl={question.imageUrl} videoUrl={question.videoUrl} />
          ) : null}
          <Headline
            headline={getLocalizedValue(question.headline, languageCode)}
            questionId={question.id}
            required={question.required}
          />
          <Subheader
            subheader={question.subheader ? getLocalizedValue(question.subheader, languageCode) : ""}
            questionId={question.id}
          />

          <div className="fb-flex fb-flex-col fb-space-y-2 fb-mt-4 fb-w-full">
            {fields.map((field, index) => {
              const isFieldRequired = () => {
                if (field.required) {
                  return true;
                }

                // if all fields are optional and the question is required, then the fields should be required
                if (
                  fields.filter((currField) => currField.show).every((currField) => !currField.required) &&
                  question.required
                ) {
                  return true;
                }

                return false;
              };

              let pattern;
              let title;
              if (code == "") {
                pattern = "^\\+[0-9]+$";
                title = "Please fill in your country-code (+123456789)"
              } else {
                pattern = "^[0-9]+$";
                title = "You allready selected a country. Please type just numbers (123456789)"
              }
              let inputType = "text";
              if (field.id === "email") {
                inputType = "email";
              }

              return (
                field.show && (
                  <div>
                    <div style={{ display: "flex" }} key={field.id}>
                      {field.id === "phone" && (
                        <CountrySelector currentCountry={countryCode} onToggleDropdown={toggleDropdown} />
                      )}
                      <Input
                        style={{ zIndex: "1" }}
                        ref={index === 0 ? contactInfoRef : null}
                        key={field.id}
                        placeholder={isFieldRequired() ? `${field.placeholder}*` : field.placeholder}
                        required={isFieldRequired()}
                        value={safeValue[index] || ""}
                        className="fb-py-3"
                        type={inputType}
                        pattern={field.id === "phone" ? pattern : undefined}
                        title={title}
                        onChange={(e) => {
                          handleChange(field.id, e.currentTarget.value);
                        }}
                        tabIndex={isCurrent ? 0 : -1}
                        id={field.id === "phone" ? "inputPhone" : undefined}
                      />
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </ScrollableContainer>

      <div className="fb-flex fb-flex-row-reverse fb-w-full fb-justify-between fb-px-6 fb-py-4">
        <SubmitButton
          tabIndex={isCurrent ? 0 : -1}
          buttonLabel={getLocalizedValue(question.buttonLabel, languageCode)}
          isLastQuestion={isLastQuestion}
        />
        {!isFirstQuestion && (
          <BackButton
            tabIndex={isCurrent ? 0 : -1}
            backButtonLabel={getLocalizedValue(question.backButtonLabel, languageCode)}
            onClick={() => {
              const updatedttc = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
              setTtc(updatedttc);
              onBack();
            }}
          />
        )}
      </div>
      <CountryDropdown show={showCountryDropdown} onSelectCountry={handleCountryCodeChange} onToggleDropdown={toggleDropdown} />
    </form>
  );
}
