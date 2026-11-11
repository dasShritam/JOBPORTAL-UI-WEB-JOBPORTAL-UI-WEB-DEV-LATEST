import { useEffect, useRef, useState } from "react";

interface AutoCompleteProps {
    data: string[],
    value: string,
    name: string
}

const AutoComplete = (props: AutoCompleteProps) => {

    const options = props.data

    const [value, setValue] = useState(props.value);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestions = options.filter(option => option.toLowerCase().includes(value.toLowerCase()))

    const autocompleteRef = useRef<any>();

    useEffect(() => {
        const handleClick = (event: any) => {
            if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
                setShowSuggestions(false)
            }
        };
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])

    const handleChange = (event: any) => {
        setValue(event.target.value);
        if (event.target.value) {
            setShowSuggestions(true)
        }
        else {
            setShowSuggestions(false)
        }
    }

    const handleSuggestionClick = (suggetion: any) => {
        setValue(suggetion);
        setShowSuggestions(false);
    }

    return (
        <div className="autocomplete" ref={autocompleteRef}>
            <div className="form-group">
                <input
                    className="form-control"
                    value={value}
                    onChange={handleChange}
                    placeholder="Search"
                />
                {showSuggestions && (
                    <ul className="suggestions">
                        {suggestions.map(suggestion => (
                            <li onClick={() => handleSuggestionClick(suggestion)} key={suggestion}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}

            </div>
        </div>


    )
};

export default AutoComplete;