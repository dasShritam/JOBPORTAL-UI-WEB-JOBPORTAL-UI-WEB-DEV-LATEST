// import "./styles.css";
import React, { useEffect, useRef, useState } from "react";
import Select, { components } from "react-select";

const options = [
  {
    label: "Group 1",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ],
  },
  {
    label: "Group 2",
    options: [
      { value: "option3", label: "Option 3" },
      { value: "option4", label: "Option 4" },
    ],
  },
];

const CheckboxOption = ({ children, isSelected }) => {
  return (
    <div>
      <label>
        <input type="checkbox" checked={isSelected} readOnly />
        {children}
      </label>
    </div>
  );
};
const Testing2 = () => {
  const [selectedOptions, setSelectedOptions] = useState<any>([]);

  const handleOptionSelect = (option: any) => {
    setSelectedOptions((prevSelectedOptions: any) => {
      if (prevSelectedOptions.includes(option)) {
        return prevSelectedOptions.filter((o) => o !== option);
      } else {
        return [...prevSelectedOptions, option];
      }
    });
  };

  const optionRenderer = (props: any) => {
    const isSelected: any = selectedOptions.includes(props.data);

    return (
      <components.Option {...props}>
        <CheckboxOption isSelected={isSelected}>
          {props.children}
        </CheckboxOption>
      </components.Option>
    );
  };

  return (
    <Select
      options={options}
      isMulti
      closeMenuOnSelect={false}
      components={{ Option: optionRenderer }}
      onChange={handleOptionSelect}
    />
  );
}

export default Testing2;
