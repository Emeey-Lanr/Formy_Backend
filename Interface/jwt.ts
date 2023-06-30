
export interface jwtPayload {
    emailUsername: string,
    number:number
}
export interface SubmitFormPayload {
    form_title: string;
    form_description: string;
    form_link: string;
    user_email: string;
    form_details: {}[]
    submit_details: {}[],
    owner_id:string,
}

export interface TopThree {
  form_title: string;
  form_description:string;
  link: string;
  totalSubmit: number;
}

export interface Ranking {
  form_title: string;
  form_description:string;
  form_link: string;
  totalSubmit: number;
  rank: number;
}