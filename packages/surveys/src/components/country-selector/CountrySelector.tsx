interface CountrySelectorProps {
    currentCountry: string;
    onToggleDropdown: () => void;
  }
  
  const CountrySelector = ({ currentCountry, onToggleDropdown }: CountrySelectorProps) => {
  
    return (
      <div style={{
        width: "25%",
        marginRight: "-8px",
      }}>
        <button
          id="dropdownButton"
          type="button"
          onClick={onToggleDropdown}
          style={{
            backgroundColor: `var(--fb-input-background-color)`,
            border: "none",
            width: "100%",
            height: "40px",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
            marginRight: "-8px",
            color: `var(--fb-subheading-color)`,
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "flexStart",
            paddingLeft: "0.75em",
          }}
        >
          {currentCountry}
        </button>
      </div>
    );
  };
  
  export default CountrySelector;
  