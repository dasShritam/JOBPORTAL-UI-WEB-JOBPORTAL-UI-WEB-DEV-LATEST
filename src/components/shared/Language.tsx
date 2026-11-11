import Select from "react-select";
import { customStyles } from "../../common/common";
const checkBoxList = [
  { value: "Speak", label: "speak" },
  { value: "Read", label: "read" },
  { value: "Write", label: "write" },
];
const Language = (props: any) => {
  const proficiencyArr = [
    { value: 1, label: "Beginner" },
    { value: 2, label: "Proficient" },
    { value: 3, label: "Expert" },
  ];
  return (
    <>
      <style> {` .CursorsPointer{ cursor:pointer; } } `} </style>
      <>
        <div>
          <div className="col-lg-12 col-md-12">
            <div className="form-group"></div>
            <div className="form-group">
              <div className="row">
                <label className="col-lg-6 col-md-6 col-sm-6 col-6">
                  Language <span id="manditory">*</span>
                </label>
                <label className="col-lg-6 col-md-6 col-sm-6 col-6">
                  Proficiency <span id="manditory">*</span>
                </label>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                  <input
                    type="text"
                    name={`language[${props.index}].name`}
                    onChange={(e: any) => {
                      props.handleChange(e);
                    }}
                    value={props.value.name}
                    placeholder="Enter language"
                    className="form-control"
                    onBlur={props.handleBlur}
                  />
                  {props?.error?.name &&
                    props?.touched?.language?.[props.index]?.name && (
                      <p className="form-error">{props?.error?.name}</p>
                    )}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                  <Select
                    placeholder="Select Proficiency"
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={false}
                    name={`language[${props.index}].level`}
                    options={proficiencyArr}
                    className={"dropstyle"}
                    styles={customStyles}
                    menuPlacement="top"
                    value={proficiencyArr.find(
                      (item: any) => item.label === props?.value?.level
                    )}
                    onChange={(v: any, a: any) => {
                      if (a.action === "select-option")
                        props.language[props.index].level = v.label;
                      else props.language[props.index].level = "";
                      props.setFieldValue("language", [...props.language]);
                    }}
                    onBlur={() => {
                      props.touched.language[props.index].level = true;
                      props.setFieldValue("language", [...props.language]);
                    }}
                  />
                  {props?.error?.level &&
                    props?.touched?.language?.[props.index]?.level && (
                      <p className="form-error">{props?.error?.level}</p>
                    )}
                </div>
              </div>
            </div>
            <div className="col s12">
              <div className="row">
                {checkBoxList?.map((check: any) => {
                  return (
                    <div className="col s3">
                      <input
                        type="checkbox"
                        name={check.value}
                        id={check.value + props.index}
                        value={check.value}
                        checked={props?.language[props.index].ability?.includes(
                          check.value
                        )}
                        onClick={(event: any) => {
                          if (event.target.checked) {
                            props.language[props.index].ability?.push(
                              event.target.value
                            );
                          } else {
                            const i = props.language[
                              props.index
                            ].ability.indexOf(event.target.value);
                            props.language[props.index].ability?.splice(i, 1);
                          }
                          props.setFieldValue("language", [...props.language]);
                        }}
                        className="CursorsPointer"
                      />
                      <label
                        htmlFor={check.value + props.index}
                        className="CursorsPointer ml-2"
                      >
                        {check.value}
                      </label>
                    </div>
                  );
                })}
                <div className="col s3">
                  <label
                    className="CursorsPointer"
                    onClick={() => {
                      props.deleteHandler(
                        props?.value._id,
                        props.index,
                        props.language,
                        props.setFieldValue,
                        props.setFieldTouched,
                        props.setFieldError
                      );
                    }}
                  >
                    <span style={{ color: "red" }}>Delete</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};
export default Language;
