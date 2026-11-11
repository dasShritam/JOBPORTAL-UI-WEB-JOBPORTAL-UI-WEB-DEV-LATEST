export type ProfileStateType = {
  name: string;
  mobile: string;
  desg: string;
  location: string;
  emial: string;
  profileStrength: Number;
  fresher: Boolean;
  currentlyEmployed:boolean;
  experience: {
    month: string;
    year: string;
    currency: String;
    curr_ctc: Number;
    notice_period: String;
  };
  curr_location: {
    city: String;
    state: String;
    country: String;
  };
  contacts: [
    {
      country_code: String;
      area_code: String;
      phno: String;
    }
  ];
};

export type typeProfile = {
  _id: string;
  user_id: string;
  profile_info: {
    name: String;
    dob_ts: Number;
    gender: String;
    marital_status: String;

    img: {
      name: String; //Name with extension
      updated_at: Number;
    };
    intro_video: {
      name: String; //Name with extension
      updated_at: Number;
    };
    addresses: [
      {
        street: String;
        city: String;
        state: String;
        country: String;
        zip: String;
      }
    ];
    fresher: Boolean;
    experience: {
      month: string;
      year: string;
      currency: String;
      curr_ctc: Number;
      notice_period: String;
    };
    category: String; //OBC or SC/ST
    disability: Boolean;
    career_break: {
      from_break: Boolean;
      reason: String;
      duration: {
        from_ts: Number;
        till_ts: Number;
      };
    };
    contacts: [
      {
        country_code: String;
        area_code: String;
        phno: String;
      }
    ];
    curr_location: {
      city: String;
      state: String;
      country: String;
    };
    languages: [
      {
        name: String;
        ability: [String];
        level: String; //Expert or Proficient or Beginner
      }
    ];
  };
  headline: String;
  summary: String;
  cv: {
    name: String;
    updated_at: Number;
  };
  skills: {
    key: [String];
    it: [
      {
        _id: string;
        name: String;
        ver: String;
        exp: {
          month: Number;
          year: Number;
        };
        last_used: Number;
      }
    ];
  };
  edu: {
    schools: [
      {
        _id: string;
        course: string;
        medium: String;
        board: String;
        eng_marks: Number;
        math_marks: Number;
        grade: String;
        marks: String;
        completion_year: Number;
      }
    ];
    degree: [
      {
        _id: string;
        institute: String;
        course: String;
        stream: String;
        grade: String;
        marks: String;
        start_year: Number;
        completion_year: Number;
      }
    ];
  };
  proj: [
    {
      title: String;
      desc: String;
      client: String;
      location: String;
      skills: [String];
      designation: {
        name: String;
        desc: String;
      };
      employment_type: String;
      team_size: Number;
      on_site: Boolean;
      edu_tag: string;
      start_ts: Number;
      end_ts: Number;
    }
  ];
  social_profile: [
    {
      _id: string;
      name: String;
      desc: String;
      uri: String;
    }
  ];
  online_ppt: [
    {
      _id: string;
      title: String;
      desc: String;
      uri: String;
    }
  ];
  work_sample: [
    {
      _id: string;
      title: String;
      desc: String;
      start_ts: Number;
      end_ts: Number;
      uri: String;
    }
  ];
  publication: [
    {
      _id: string;
      title: String;
      desc: String;
      uri: String;
      published_ts: Number;
    }
  ];
  patent: [
    {
      _id: string;
      app_no: String;
      title: String;
      desc: String;
      uri: String;
      status: String; // Issued or Pending
      ofc: String; //Patent office
      published_ts: Number;
      issued_ts: Number; // 01/01/2023
    }
  ];
  certification: [
    {
      _id: string;
      name: String;
      issued_by: String;
      completion_year: Number;
      uri: String;
      issued_ts: Number;
      expiry_ts: Number;
    }
  ];
  career_profile: {
    industry: String;
    dept: String;
    category: String;
    job_role: String;
    job_type: [String];
    employment_type: [String];
    shift: String;
    pref_location: [String];
    exp_ctc: {
      currency: String;
      val: Number;
    };
    job_offer: {
      currency: String;
      val: Number;
    };
    any_offer: Boolean;
  };
};
