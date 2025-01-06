import axios from "axios";
import { useEffect, useState } from 'react';
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
	const [values, setValues] = useState(initialFormValues);
	const [errors, setErrors] = useState(initalErrors);
  
	const [success, setSuccess] = useState("");
	const [failure, setFailure] = useState("");
	const [enabled, setEnabled] = useState(false);
  
	useEffect(() => {
	  formSchema.isValid(values).then((isValid) => {
		setEnabled(isValid);
	  });
	}, [values]);

	const handleSubmit = (evt) => {
		evt.preventDefault();
		const { fullName, size, toppings } = values;
		axios
		  .post("http://localhost:9009/api/order", values)
	
		  .then((res) => {
			setSuccess(res.data.message);
			setFailure("");
		  })
		  .catch((res) => {
			setFailure(res.response.data.message);
		  });
	
		setValues({
		  fullName: "",
		  size: "",
		  toppings: [],
		});
	  };

	  const handleChange = (evt) => {
		let { type, checked, name, value } = evt.target;
	
		if (type === "checkbox") {
		  const toppingId = name; // Use the checkbox name as the topping ID
		  const updatedToppings = checked
			? [...values.toppings, toppingId] // Add the topping if checked
			: values.toppings.filter((id) => id !== toppingId); // Remove if unchecked
	
		  setValues({ ...values, toppings: updatedToppings });
		} else {
		  setValues({ ...values, [name]: value });
		}
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
				{errors.fullName && <div className="error">{errors.fullName}</div>}
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
				{errors.size && <div className="error">{errors.size}</div>}
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
);


