class ErrorMessages():
    def missing_keys(keys):
        return f"Missing key: {', '.join(keys)}"

    def keys_mismatch(input_keys, master_keys):
        if len(master_keys) == 0:
            return f"Key mismatch: '{input_keys}' mismatched with empty set"
        return f"Key mismatch: '{input_keys}' mismatched with '{master_keys}'"

    def type_mismatch(param, expected_type, received_type):
        return f"Type error: '{param}' expected {expected_type} but got {received_type}"

    def invalid_value(param, reason):
        return f"Value error: '{param}' is invalid. Reason: {reason}"

    def generic_error(message):
        return message