import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { validator } from '../../../lib/errors/validator';

const FormComponent = ({
  children,
  validatorConfig,
  onSubmit,
  defaultData = {},
  requiredFields = [],
}) => {
  const [data, setData] = useState(defaultData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((target) => {
    const { name, value } = target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  useEffect(() => {
    setErrors(validator(data, validatorConfig));
  }, [data, validatorConfig]);

  const validate = useCallback(() => {
    const errors = validator(data, validatorConfig);
    return Object.keys(errors).length === 0;
  }, [data, validatorConfig]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const allTouched = Object.keys(data).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setTouched(allTouched);

    if (!validate()) return;

    onSubmit(data);

    setErrors({});
    setTouched({});
  };

  const handleKeyDown = useCallback((event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1]?.focus();
    }
  }, []);

  const isValid = useMemo(() => {
    return requiredFields.every(
      (field) => String(data[field] || '').trim() !== '' && !errors[field]
    );
  }, [data, errors, requiredFields]);

  const clonedElements = useMemo(() => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      let config = {};

      if (typeof child.type !== 'string') {
        if (!child.props.name) {
          throw new Error('Name property is required for field components');
        }

        config = {
          ...child.props,
          onChange: handleChange,
          value: data[child.props.name] ?? '',
          error: touched[child.props.name] && errors[child.props.name],
          onKeyDown: handleKeyDown,
        };
      }

      if (child.type === 'button') {
        const isSubmit =
          child.props.type === 'submit' || child.props.type === undefined;
        if (isSubmit) {
          config = { ...child.props, disabled: !isValid };
        }
      }

      return React.cloneElement(child, config);
    });
  }, [children, data, errors, touched, isValid, handleChange, handleKeyDown]);

  if (typeof children === 'function') {
    return <form onSubmit={handleSubmit}>{children(data)}</form>;
  }

  return <form onSubmit={handleSubmit}>{clonedElements}</form>;
};

FormComponent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  requiredFields: PropTypes.array,
  defaultData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  validatorConfig: PropTypes.object,
};

export default FormComponent;
