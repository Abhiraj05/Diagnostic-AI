from random import randint

# generates otp
def generate_otp():
    random_num = str(randint(0000, 9999))
    return random_num


# creates otp key
def otp_key(email):
    return f"otpkey:{email}"