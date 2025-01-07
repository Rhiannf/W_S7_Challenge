import axios from "axios";
import React, { useEffect, useState } from 'react';
import * as yup from "yup";

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L',
}

// 👇 Here you will create your schema.

const formSchema = yup.object().shape({
	fullName: yup
	.string()
	.required("Full name is required")
	.min(3, validationErrors.fullNameTooShort)
	.max(20, validationErrors.fullNameTooLong),
	size: yup
	.string()
	.required("Size is required")
	.oneOf(["S", "M", "L"], validationErrors.sizeIncorrect),
	 toppings: yup.array().of(yup.string()),
  });
  
  const initialFormValues = {
	fullName: "",
	size: "",
	toppings: [],
  
  };
  
  const initalErrors = {
	fullName: "",
	size: "",
  
  };


// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

export default function Form() {
	const [formValues, setValues] = useState(initialFormValues);
	const [errorMessage, setErrors] = useState(initalErrors);
  
	const [successMessage, setSuccess] = useState("");
	const [failure, setFailure] = useState("");
	const [disabled, setEnabled] = useState(false);
  
	useEffect(() => {
	  formSchema.isValid(values).then((isValid) => {
		setEnabled(isValid);
	  });
	}, [formValues]);

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
		  .post("http://localhost:9009/api/order", formValues)
	
		  .then((res) => {
			setSuccess(res.data.message);
			formValues(initialFormValues);
			setFailure("");
		  })
		  .catch((res) => {
			setFailure(res.response.data.message);
			errorMessage(err.response.data.message);
			formValues(initialFormValues);
		  });
	
		setValues({
		  fullName: "",
		  size: "",
		  toppings: [],
		});
	  };

	  const handleChange = (e) => {
		const { name, value, checked, type } = e.target;
		if (type === "checkbox") {
			formValues({
				...formValues,
				toppings: checked
					? [...formValues.toppings, value]
					: formValues.toppings.filter((topping) => topping !== value),
			});
		} else {
			formValues({
				...formValues,
				[name]: value,
			});
		}

		if (name === "fullName" || name === "size") {
			yup
				.reach(formSchema, name)
				.validate(value.trim())
				.then(() => {
					setErrors({
						...errors,
						[name]: "",
					});
				})
				.catch((err) => {
					setErrors({
						...errors,
						[name]: err.errors[0],
					});
				});
		}
	};


	return (
		<form onSubmit={handleSubmit}>
			<h2>Order Your Pizza</h2>
			{successMessage && <div className="success">{successMessage}</div>}
			{errorMessage && <div className="failure">{errorMessage}</div>}

			<div className="input-group">
				<div>
					<label htmlFor="fullName">Full Name</label>
					<br />
					<input
						onChange={handleChange}
						value={formValues.fullName}
						placeholder="Type full name"
						name="fullName"
						id="fullName"
						type="text"
					/>
				</div>
				{failure.fullName && <div className="error">{failure.fullName}</div>}
			</div>

			<div className="input-group">
				<div>
					<label htmlFor="size">Size</label>
					<br />
					<select
						name="size"
						onChange={handleChange}
						value={formValues.size}
						id="size"
					>
						<option value="">----Choose Size----</option>
						<option value="S">Small</option>
						<option value="M">Medium</option>
						<option value="L">Large</option>
					</select>
				</div>
				{setErrors.size && <div className="error">{setErrors.size}</div>}
			</div>

			<div className="input-group"></div>
		
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map((topping) => (
					<label key={topping.topping_id}>
						<input
							onChange={handleChange}
							checked={formValues.toppings.includes(topping.topping_id)}
							value={topping.topping_id}
							name={topping.text}
							type="checkbox"
						/>
						{topping.text}
						<br />
					</label>
				))}
			/{'>'}
  ;
  	{/* 👇 Make sure the submit stays disabled until the form validates! */}
	  <input disabled={disabled} type="submit" />
	  </form>

)};



