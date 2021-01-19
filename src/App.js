import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import axios from 'axios';

import './App.css';

// creez schema
const schema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email address')
    .required('Must include email address'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 chars length')
    .required('Password is required'),
  terms: Yup.boolean().oneOf([true], 'You must accept terms and conditions'),
});

const initialState = {
  email: '',
  password: '',
  terms: false,
};

function App() {
  // value ✅
  // onChange ✅
  // handleChange ✅
  // state-ul ✅
  const [formState, setFormState] = useState(initialState);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errorsState, setErrorsState] = useState({
    email: '',
    password: '',
    terms: '',
  });

  function handleFieldValidaton(e) {
    Yup.reach(schema, e.target.name)
      .validate(e.target.value)
      .then(() => {
        // este valid
        setErrorsState({
          ...errorsState,
          [e.target.name]: '',
        });
      })
      .catch((err) => {
        setErrorsState({
          ...errorsState,
          [e.target.name]: err.errors[0],
        });
      });
  }

  function handleChange(e) {
    handleFieldValidaton(e);
    setFormState({
      ...formState,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  }

  // oricand se schimba formState, vreau sa il validez
  useEffect(() => {
    async function helper() {
      const valid = await schema.isValid(formState);
      setIsButtonDisabled(!valid);
    }

    helper();
  }, [formState]);

  function handleSubmit(e) {
    e.preventDefault();

    setFormState(initialState);

    // API requesturi
    // https://my-api.com/users/create
    axios.post('https://my-api.com/users/create', formState);

    // GET
    // POST
    // PUT
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="emailInput">
            Email
            <input
              id="emailInput"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formState.email}
            />
            {errorsState.email ? (
              <p style={{ fontSize: '12px', color: 'red' }}>
                {errorsState.email}
              </p>
            ) : null}
          </label>
        </div>
        <div>
          <label htmlFor="passwordInput">
            Password
            <input
              id="passwordInput"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formState.password}
            />
            {errorsState.password ? (
              <p style={{ fontSize: '12px', color: 'red' }}>
                {errorsState.password}
              </p>
            ) : null}
          </label>
        </div>

        <div>
          <label htmlFor="termsInput">
            Do you agree to the terms and conditions?
            <input
              id="termsInput"
              type="checkbox"
              name="terms"
              onChange={handleChange}
              checked={formState.terms}
            />
          </label>
        </div>

        <button disabled={isButtonDisabled}>Submit</button>
      </form>

      <pre>
        {JSON.stringify(formState)}
      </pre>
    </div>
  );
}

export default App;
