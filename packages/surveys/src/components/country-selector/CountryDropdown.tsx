import { useRef, useState, useEffect, useCallback } from "preact/hooks";
import countryFile from "./countries.json";

interface CountryDropdownProps {
    show: boolean;
    onSelectCountry: (countryFlag: string, countryCode: string) => void;
    onToggleDropdown: () => void;
}

const CountryDropdown = ({ show, onSelectCountry, onToggleDropdown }: CountryDropdownProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [searchTerm, setSearchTerm] = useState("");
    const [focusedButtonIndex, setFocusedButtonIndex] = useState<number | null>(null);

    // The levenshteinDistance returns the distance of two strings.
    // Here we compare the searchterm with the country-name
    function levenshteinDistance(str1: string, str2: string) {
        const len1 = str1.length;
        const len2 = str2.length;
        let matrix = Array(len1 + 1);
        for (let i = 0; i <= len1; i++) { matrix[i] = Array(len2 + 1); }
        for (let i = 0; i <= len1; i++) { matrix[i][0] = i; }
        for (let j = 0; j <= len2; j++) { matrix[0][j] = j; }
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (str1[i - 1] === str2[j - 1]) { matrix[i][j] = matrix[i - 1][j - 1]; }
                else {
                    const deletionCost = matrix[i - 1][j] + 1;
                    const replacementCost = matrix[i - 1][j - 1] + 1;
                    let insertionCost;
                    if (j === len2) { insertionCost = matrix[i][j - 1] + 0.01; }
                    else { insertionCost = matrix[i][j - 1] + 0.5; }
                    matrix[i][j] = Math.min(deletionCost, replacementCost, insertionCost);
                }
            }
        }
        return matrix[len1][len2];
    }

    // Searching the best results for the search input
    interface Country {
        name: string;
        englishName: string;
        code: string;
        flag: string;
    }

    const calculateMatchDistance = useCallback((country: Country): [number, boolean] => {
        const distanceLocalName = levenshteinDistance(searchTerm, country.name.toLowerCase());
        const distanceEnglishName = levenshteinDistance(searchTerm, country.englishName.toLowerCase());
        const matchesCode = levenshteinDistance(searchTerm, country.code);
        let isEnglishMatch = distanceEnglishName < distanceLocalName;
        if (matchesCode < distanceEnglishName) {
            isEnglishMatch = false;
        }
        return [Math.min(distanceEnglishName, distanceLocalName, matchesCode), isEnglishMatch];
    }, [levenshteinDistance, searchTerm]);

    const checkStartsWithSearchTerm = useCallback((country: Country): boolean => {
        const startsWithSearchTermLocal = country.name.toLowerCase().startsWith(searchTerm.toLowerCase());
        const startsWithSearchTermEnglish = country.englishName.toLowerCase().startsWith(searchTerm.toLowerCase());
        const startsWithSearchTermCode = country.code.startsWith(searchTerm || "+" + searchTerm);
        return startsWithSearchTermEnglish || startsWithSearchTermLocal || startsWithSearchTermCode;
    }, [searchTerm]);

    const [filteredCountries, setFilteredCountries] = useState<Array<{ country: Country, matchDistance: number, isEnglishMatch: boolean }>>([]);

    useEffect(() => {
        const results = countryFile.map((country) => {
            let [matchDistance, isEnglishMatch] = calculateMatchDistance(country);
            const englishCountryBool = checkStartsWithSearchTerm(country);
            if (englishCountryBool) { matchDistance *= 0.3; }
            return { country, matchDistance, isEnglishMatch };
        });

        if (searchTerm.length !== 0) {
            results.sort((a, b) => a.matchDistance - b.matchDistance);
        }

        setFilteredCountries(results);
    }, [searchTerm, calculateMatchDistance, checkStartsWithSearchTerm]);

    // Handling the dropdown position
    useEffect(() => {
        if (show && dropdownRef.current) {
            const buttonElement = document.getElementById("dropdownButton");
            if (buttonElement) {
                const rect = buttonElement.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                });
            } else { console.warn("Did not find the dropdown."); }
            let inputRef = document.getElementById("searchbar");
            if (inputRef && inputRef instanceof HTMLInputElement) {
                inputRef.focus();
                inputRef.select();
            }
        }
    }, [show]);

    const handleSearchChange = (e: Event) => {
        let target = e.target as HTMLInputElement;
        setSearchTerm(target.value);
        setFocusedButtonIndex(0);
    };

    // after selecting a country put the focus on phone-input
    // delete the country-select if the input is empty
    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && show) {
            const dropdown = dropdownRef.current;
            let firstButton = dropdown?.querySelector("button");
            const focusedButton = document.activeElement as HTMLButtonElement;
            e.preventDefault();
            if (searchTerm.length == 0) { handleCountrySelect("", ""); }
            else {
                if (focusedButton && focusedButton.tagName === "BUTTON") { focusedButton.click(); }
                else { if (firstButton) { firstButton.click(); } }
            }
        }
    };

    const handleCountrySelect = (countryFlag: string, countryCode: string) => {
        onSelectCountry(countryFlag, countryCode);
        onToggleDropdown();
    };

    if (!show) return null;
    return (
        <div
            ref={dropdownRef}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                height: "144px",
                position: "fixed",
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                zIndex: 1000,
                width: "320px",
                backgroundColor: `var(--fb-input-background-color)`,
                padding: "8px 16px 8px 0",
                borderRadius: "8px",
                marginTop: "4px",
                boxShadow: "1px 2px 4px 0px var(--fb-survey-shadow-color)"
            }}
            onKeyDown={handleKeyPress}
            id="dropdownContainer"
        >

            <div
                style={{
                    width: "100%",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "4px",
                }}
            >
                <input
                    style={{
                        backgroundColor: `var(--fb-survey-background-color)`,
                        color: `var(--fb-heading-color)`,
                        paddingLeft: "8px",
                        borderRadius: "8px",
                        width: "263px",
                        zIndex: "200",
                    }}
                    type="text"
                    placeholder="search..."
                    onChange={handleSearchChange}
                    value={searchTerm}
                    id="searchbar"
                />
            </div>
            <div style={{
                overflowY: "scroll",
                width: "100%",
                padding: "4px 0 4px 16px",
            }}>
                {filteredCountries.map((match, index) => (
                    <button
                        style={{
                            color: `var(--fb-subheading-color)`,
                            display: "flex",
                            borderRadius: "8px",
                            padding: "0 4px 0 4px",
                            marginBottom: "4px",
                            boxShadow: focusedButtonIndex === index ? "1px 2px 4px 0px var(--fb-survey-shadow-color)" : "none",
                            outline: "none",
                        }}
                        key={match.country.code}
                        id={"button" + index}
                        onClick={() => handleCountrySelect(match.country.flag, match.country.code)}
                        onFocus={() => setFocusedButtonIndex(index)}
                    >
                        {match.country.flag}&nbsp;
                        <span>{match.isEnglishMatch ? match.country.englishName : match.country.name}</span>&nbsp;
                        <span>{match.country.code}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CountryDropdown;
