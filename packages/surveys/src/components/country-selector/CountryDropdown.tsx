import { useRef, useState, useEffect } from "preact/hooks";

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

    const countries = [
        { name: "افغانستان", englishName: "Afghanistan", code: "+93", flag: "🇦🇫" },
        { name: "الجزائر", englishName: "Algeria", code: "+213", flag: "🇩🇿" },
        { name: "Argentina", englishName: "Argentina", code: "+54", flag: "🇦🇷" },
        { name: "Հայաստան", englishName: "Armenia", code: "+374", flag: "🇦🇲" },
        { name: "Australia", englishName: "Australia", code: "+61", flag: "🇦🇺" },
        { name: "Österreich", englishName: "Austria", code: "+43", flag: "🇦🇹" },
        { name: "বাংলাদেশ", englishName: "Bangladesh", code: "+880", flag: "🇧🇩" },
        { name: "البحرين", englishName: "Bahrain", code: "+973", flag: "🇧🇭" },
        { name: "Belgique", englishName: "Belgium", code: "+32", flag: "🇧🇪" },
        { name: "འབྲུག", englishName: "Bhutan", code: "+975", flag: "🇧🇹" },
        { name: "Bolivia", englishName: "Bolivia", code: "+591", flag: "🇧🇴" },
        { name: "Brasil", englishName: "Brazil", code: "+55", flag: "🇧🇷" },
        { name: "България", englishName: "Bulgaria", code: "+359", flag: "🇧🇬" },
        { name: "Burkina Faso", englishName: "Burkina Faso", code: "+226", flag: "🇧🇫" },
        { name: "Uburundi", englishName: "Burundi", code: "+257", flag: "🇧🇮" },
        { name: "កម្ពុជា", englishName: "Cambodia", code: "+855", flag: "🇰🇭" },
        { name: "Canada", englishName: "Canada", code: "+1", flag: "🇨🇦" },
        { name: "Chile", englishName: "Chile", code: "+56", flag: "🇨🇱" },
        { name: "中国", englishName: "China", code: "+86", flag: "🇨🇳" },
        { name: "Colombia", englishName: "Colombia", code: "+57", flag: "🇨🇴" },
        { name: "جزر القمر", englishName: "Comoros", code: "+269", flag: "🇰🇲" },
        { name: "Congo", englishName: "Congo (Congo-Brazzaville)", code: "+242", flag: "🇨🇬" },
        { name: "Congo", englishName: "Congo (Congo-Kinshasa)", code: "+243", flag: "🇨🇩" },
        { name: "Costa Rica", englishName: "Costa Rica", code: "+506", flag: "🇨🇷" },
        { name: "Hrvatska", englishName: "Croatia", code: "+385", flag: "🇭🇷" },
        { name: "Cuba", englishName: "Cuba", code: "+53", flag: "🇨🇺" },
        { name: "Κύπρος", englishName: "Cyprus", code: "+357", flag: "🇨🇾" },
        { name: "Česká republika", englishName: "Czech Republic", code: "+420", flag: "🇨🇿" },
        { name: "Danmark", englishName: "Denmark", code: "+45", flag: "🇩🇰" },
        { name: "Djibouti", englishName: "Djibouti", code: "+253", flag: "🇩🇯" },
        { name: "Dominica", englishName: "Dominica", code: "+1-767", flag: "🇩🇲" },
        { name: "República Dominicana", englishName: "Dominican Republic", code: "+1-809", flag: "🇩🇴" },
        { name: "Ecuador", englishName: "Ecuador", code: "+593", flag: "🇪🇨" },
        { name: "مصر‎", englishName: "Egypt", code: "+20", flag: "🇪🇬" },
        { name: "El Salvador", englishName: "El Salvador", code: "+503", flag: "🇸🇻" },
        { name: "Guinea Ecuatorial", englishName: "Equatorial Guinea", code: "+240", flag: "🇬🇶" },
        { name: "Eritrea", englishName: "Eritrea", code: "+291", flag: "🇪🇷" },
        { name: "Eesti", englishName: "Estonia", code: "+372", flag: "🇪🇪" },
        { name: "Eswatini", englishName: "Eswatini", code: "+268", flag: "🇸🇿" },
        { name: "ኢትዮጵያ", englishName: "Ethiopia", code: "+251", flag: "🇪🇹" },
        { name: "Fiji", englishName: "Fiji", code: "+679", flag: "🇫🇯" },
        { name: "Suomi", englishName: "Finland", code: "+358", flag: "🇫🇮" },
        { name: "France", englishName: "France", code: "+33", flag: "🇫🇷" },
        { name: "Gabon", englishName: "Gabon", code: "+241", flag: "🇬🇦" },
        { name: "Gambia", englishName: "Gambia", code: "+220", flag: "🇬🇲" },
        { name: "საქართველო", englishName: "Georgia", code: "+995", flag: "🇬🇪" },
        { name: "Deutschland", englishName: "Germany", code: "+49", flag: "🇩🇪" },
        { name: "Ghana", englishName: "Ghana", code: "+233", flag: "🇬🇭" },
        { name: "Ελλάδα", englishName: "Greece", code: "+30", flag: "🇬🇷" },
        { name: "Grenada", englishName: "Grenada", code: "+1-473", flag: "🇬🇩" },
        { name: "Guatemala", englishName: "Guatemala", code: "+502", flag: "🇬🇹" },
        { name: "Guinée", englishName: "Guinea", code: "+224", flag: "🇬🇳" },
        { name: "Guiné-Bissau", englishName: "Guinea-Bissau", code: "+245", flag: "🇬🇼" },
        { name: "Guyana", englishName: "Guyana", code: "+592", flag: "🇬🇾" },
        { name: "Haïti", englishName: "Haiti", code: "+509", flag: "🇭🇹" },
        { name: "Honduras", englishName: "Honduras", code: "+504", flag: "🇭🇳" },
        { name: "Magyarország", englishName: "Hungary", code: "+36", flag: "🇭🇺" },
        { name: "Ísland", englishName: "Iceland", code: "+354", flag: "🇮🇸" },
        { name: "भारत", englishName: "India", code: "+91", flag: "🇮🇳" },
        { name: "Indonesia", englishName: "Indonesia", code: "+62", flag: "🇮🇩" },
        { name: "ایران‎", englishName: "Iran", code: "+98", flag: "🇮🇷" },
        { name: "العراق", englishName: "Iraq", code: "+964", flag: "🇮🇶" },
        { name: "Éire", englishName: "Ireland", code: "+353", flag: "🇮🇪" },
        { name: "ישראל", englishName: "Israel", code: "+972", flag: "🇮🇱" },
        { name: "Italia", englishName: "Italy", code: "+39", flag: "🇮🇹" },
        { name: "Jamaica", englishName: "Jamaica", code: "+1-876", flag: "🇯🇲" },
        { name: "日本", englishName: "Japan", code: "+81", flag: "🇯🇵" },
        { name: "الأردن‎", englishName: "Jordan", code: "+962", flag: "🇯🇴" },
        { name: "Қазақстан", englishName: "Kazakhstan", code: "+7", flag: "🇰🇿" },
        { name: "Kenya", englishName: "Kenya", code: "+254", flag: "🇰🇪" },
        { name: "한국", englishName: "South Korea", code: "+82", flag: "🇰🇷" },
        { name: "Kosovo", englishName: "Kosovo", code: "+383", flag: "🇽🇰" },
        { name: "الكويت", englishName: "Kuwait", code: "+965", flag: "🇰🇼" },
        { name: "Кыргызстан", englishName: "Kyrgyzstan", code: "+996", flag: "🇰🇬" },
        { name: "ລາວ", englishName: "Laos", code: "+856", flag: "🇱🇦" },
        { name: "Latvija", englishName: "Latvia", code: "+371", flag: "🇱🇻" },
        { name: "لبنان", englishName: "Lebanon", code: "+961", flag: "🇱🇧" },
        { name: "Lesotho", englishName: "Lesotho", code: "+266", flag: "🇱🇸" },
        { name: "Liberia", englishName: "Liberia", code: "+231", flag: "🇱🇷" },
        { name: "ليبيا", englishName: "Libya", code: "+218", flag: "🇱🇾" },
        { name: "Liechtenstein", englishName: "Liechtenstein", code: "+423", flag: "🇱🇮" },
        { name: "Lietuva", englishName: "Lithuania", code: "+370", flag: "🇱🇹" },
        { name: "Luxembourg", englishName: "Luxembourg", code: "+352", flag: "🇱🇺" },
        { name: "Македонија", englishName: "North Macedonia", code: "+389", flag: "🇲🇰" },
        { name: "Madagascar", englishName: "Madagascar", code: "+261", flag: "🇲🇬" },
        { name: "Malawi", englishName: "Malawi", code: "+265", flag: "🇲🇼" },
        { name: "Malaysia", englishName: "Malaysia", code: "+60", flag: "🇲🇾" },
        { name: "Mali", englishName: "Mali", code: "+223", flag: "🇲🇱" },
        { name: "Malta", englishName: "Malta", code: "+356", flag: "🇲🇹" },
        { name: "Îles Marshall", englishName: "Marshall Islands", code: "+692", flag: "🇲🇭" },
        { name: "موريتانيا", englishName: "Mauritania", code: "+222", flag: "🇲🇷" },
        { name: "Mauritius", englishName: "Mauritius", code: "+230", flag: "🇲🇺" },
        { name: "المغرب", englishName: "Morocco", code: "+212", flag: "🇲🇦" },
        { name: "México", englishName: "Mexico", code: "+52", flag: "🇲🇽" },
        { name: "Монгол", englishName: "Mongolia", code: "+976", flag: "🇲🇳" },
        { name: "Монгол", englishName: "Montenegro", code: "+382", flag: "🇲🇪" },
        { name: "Moçambique", englishName: "Mozambique", code: "+258", flag: "🇲🇿" },
        { name: "Myanmar", englishName: "Myanmar", code: "+95", flag: "🇲🇲" },
        { name: "Namibia", englishName: "Namibia", code: "+264", flag: "🇳🇦" },
        { name: "नेपाल", englishName: "Nepal", code: "+977", flag: "🇳🇵" },
        { name: "Nederland", englishName: "Netherlands", code: "+31", flag: "🇳🇱" },
        { name: "Nouvelle-Calédonie", englishName: "New Caledonia", code: "+687", flag: "🇳🇨" },
        { name: "New Zealand", englishName: "New Zealand", code: "+64", flag: "🇳🇿" },
        { name: "Nicaragua", englishName: "Nicaragua", code: "+505", flag: "🇳🇮" },
        { name: "Niger", englishName: "Niger", code: "+227", flag: "🇳🇪" },
        { name: "Nigeria", englishName: "Nigeria", code: "+234", flag: "🇳🇬" },
        { name: "Niue", englishName: "Niue", code: "+683", flag: "🇳🇺" },
        { name: "Norway", englishName: "Norway", code: "+47", flag: "🇳🇴" },
        { name: "عمان", englishName: "Oman", code: "+968", flag: "🇴🇲" },
        { name: "پاکستان", englishName: "Pakistan", code: "+92", flag: "🇵🇰" },
        { name: "پالاو", englishName: "Palau", code: "+680", flag: "🇵🇼" },
        { name: "پالیسٹن‎", englishName: "Palestine", code: "+970", flag: "🇵🇸" },
        { name: "Panamá", englishName: "Panama", code: "+507", flag: "🇵🇦" },
        { name: "Papua Niugini", englishName: "Papua New Guinea", code: "+675", flag: "🇵🇬" },
        { name: "Paraguay", englishName: "Paraguay", code: "+595", flag: "🇵🇾" },
        { name: "Perú", englishName: "Peru", code: "+51", flag: "🇵🇪" },
        { name: "Pilipinas", englishName: "Philippines", code: "+63", flag: "🇵🇭" },
        { name: "Polska", englishName: "Poland", code: "+48", flag: "🇵🇱" },
        { name: "Portugal", englishName: "Portugal", code: "+351", flag: "🇵🇹" },
        { name: "Qatar", englishName: "Qatar", code: "+974", flag: "🇶🇦" },
        { name: "România", englishName: "Romania", code: "+40", flag: "🇷🇴" },
        { name: "Россия", englishName: "Russia", code: "+7", flag: "🇷🇺" },
        { name: "Rwanda", englishName: "Rwanda", code: "+250", flag: "🇷🇼" },
        { name: "Saint Kitts and Nevis", englishName: "Saint Kitts and Nevis", code: "+1-869", flag: "🇰🇳" },
        { name: "Saint Lucia", englishName: "Saint Lucia", code: "+1-758", flag: "🇱🇨" },
        { name: "Saint Vincent and the Grenadines", englishName: "Saint Vincent and the Grenadines", code: "+1-784", flag: "🇻🇨" },
        { name: "ساموا", englishName: "Samoa", code: "+685", flag: "🇼🇸" },
        { name: "San Marino", englishName: "San Marino", code: "+378", flag: "🇸🇲" },
        { name: "São Tomé and Príncipe", englishName: "São Tomé and Príncipe", code: "+239", flag: "🇸🇹" },
        { name: "السعودية", englishName: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
        { name: "Sénégal", englishName: "Senegal", code: "+221", flag: "🇸🇳" },
        { name: "Србија", englishName: "Serbia", code: "+381", flag: "🇷🇸" },
        { name: "Seychelles", englishName: "Seychelles", code: "+248", flag: "🇸🇨" },
        { name: "Sierra Leone", englishName: "Sierra Leone", code: "+232", flag: "🇸🇱" },
        { name: "Singapore", englishName: "Singapore", code: "+65", flag: "🇸🇬" },
        { name: "Slovensko", englishName: "Slovakia", code: "+421", flag: "🇸🇰" },
        { name: "Slovenija", englishName: "Slovenia", code: "+386", flag: "🇸🇮" },
        { name: "Solomon Islands", englishName: "Solomon Islands", code: "+677", flag: "🇸🇧" },
        { name: "الصومال", englishName: "Somalia", code: "+252", flag: "🇸🇴" },
        { name: "South Africa", englishName: "South Africa", code: "+27", flag: "🇿🇦" },
        { name: "South Sudan", englishName: "South Sudan", code: "+211", flag: "🇸🇸" },
        { name: "España", englishName: "Spain", code: "+34", flag: "🇪🇸" },
        { name: "Sri Lanka", englishName: "Sri Lanka", code: "+94", flag: "🇱🇰" },
        { name: "السودان", englishName: "Sudan", code: "+249", flag: "🇸🇩" },
        { name: "Suriname", englishName: "Suriname", code: "+597", flag: "🇸🇷" },
        { name: "Swaziland", englishName: "Eswatini", code: "+268", flag: "🇸🇿" },
        { name: "Sverige", englishName: "Sweden", code: "+46", flag: "🇸🇪" },
        { name: "Schweiz", englishName: "Switzerland", code: "+41", flag: "🇨🇭" },
        { name: "Сирия", englishName: "Syria", code: "+963", flag: "🇸🇾" },
        { name: "台灣", englishName: "Taiwan", code: "+886", flag: "🇹🇼" },
        { name: "Таджикистан", englishName: "Tajikistan", code: "+992", flag: "🇹🇯" },
        { name: "Tanzania", englishName: "Tanzania", code: "+255", flag: "🇹🇿" },
        { name: "ไทย", englishName: "Thailand", code: "+66", flag: "🇹🇭" },
        { name: "Timor-Leste", englishName: "Timor-Leste", code: "+670", flag: "🇹🇱" },
        { name: "Togo", englishName: "Togo", code: "+228", flag: "🇹🇬" },
        { name: "Tonga", englishName: "Tonga", code: "+676", flag: "🇹🇴" },
        { name: "Trinidad and Tobago", englishName: "Trinidad and Tobago", code: "+1-868", flag: "🇹🇹" },
        { name: "تونس", englishName: "Tunisia", code: "+216", flag: "🇹🇳" },
        { name: "Türkiye", englishName: "Turkey", code: "+90", flag: "🇹🇷" },
        { name: "Türkmenistan", englishName: "Turkmenistan", code: "+993", flag: "🇹🇲" },
        { name: "Tuvalu", englishName: "Tuvalu", code: "+688", flag: "🇹🇻" },
        { name: "اوغندا", englishName: "Uganda", code: "+256", flag: "🇺🇬" },
        { name: "Україна", englishName: "Ukraine", code: "+380", flag: "🇺🇦" },
        { name: "الإمارات", englishName: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
        { name: "United Kingdom", englishName: "United Kingdom", code: "+44", flag: "🇬🇧" },
        { name: "United States", englishName: "United States", code: "+1", flag: "🇺🇸" },
        { name: "Uruguay", englishName: "Uruguay", code: "+598", flag: "🇺🇾" },
        { name: "Oʻzbekiston", englishName: "Uzbekistan", code: "+998", flag: "🇺🇿" },
        { name: "Vanuatu", englishName: "Vanuatu", code: "+678", flag: "🇻🇺" },
        { name: "Venezuela", englishName: "Venezuela", code: "+58", flag: "🇻🇪" },
        { name: "Việt Nam", englishName: "Vietnam", code: "+84", flag: "🇻🇳" },
        { name: "اليمن", englishName: "Yemen", code: "+967", flag: "🇾🇪" },
        { name: "Zambia", englishName: "Zambia", code: "+260", flag: "🇿🇲" },
        { name: "Zimbabwe", englishName: "Zimbabwe", code: "+263", flag: "🇿🇼" },
    ];

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

    let filteredCountries = [];
    for (let country of countries) {
        let distanceLocalName = levenshteinDistance(searchTerm, country.name.toLowerCase());
        let distanceEnglishName = levenshteinDistance(searchTerm, country.englishName.toLowerCase());
        let matchesCode = levenshteinDistance(searchTerm, country.code);
        let startsWithSearchTermLocal = country.name.toLowerCase().startsWith(searchTerm.toLowerCase());
        let startsWithSearchTermEnglish = country.englishName.toLowerCase().startsWith(searchTerm.toLowerCase());
        let startsWithSearchTermCode = country.code.startsWith(searchTerm || "+" + searchTerm);
        let distance = Math.min(distanceEnglishName, distanceLocalName, matchesCode);
        let englishCountryBoolean = distanceEnglishName < distanceLocalName;
        if (matchesCode < distanceEnglishName) { englishCountryBoolean = false }
        if (startsWithSearchTermEnglish || startsWithSearchTermLocal || startsWithSearchTermCode) {
            distance *= 0.3;
        }
        filteredCountries.push({ country, distance, englishCountryBoolean })
    }
    if (searchTerm.length != 0) {
        filteredCountries.sort((a, b) => a.distance - b.distance);
    }
    filteredCountries.map((match) => { match.country.name = match.englishCountryBoolean ? match.country.englishName : match.country.name })
    filteredCountries.slice(0, 3);

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

    const handleKeyPress = (e: KeyboardEvent) => {
        const dropdown = dropdownRef.current;
        let firstButton = dropdown?.querySelector("button");
        const focusedButton = document.activeElement as HTMLButtonElement;

        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTerm.length == 0) {
                handleCountrySelect("", "");
                onToggleDropdown();
            }
            else {
                if (focusedButton && focusedButton.tagName === "BUTTON") { focusedButton.click(); }
                else { if (firstButton) { firstButton.click(); } }
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => { document.removeEventListener('keydown', handleKeyPress); };
    }, [searchTerm]);


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
                        <span>{match.country.name}</span>&nbsp;
                        <span>{match.country.code}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CountryDropdown;
