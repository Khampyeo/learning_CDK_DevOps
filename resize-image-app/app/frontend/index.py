import streamlit as st
import base64
import requests
import json

def main():
    st.title("Resize Image")

    col1, col2 = st.columns(2)

    uploaded_file = col1.file_uploader("Choose a file", type=["jpg", "jpeg", "png"])
    with col1:
        widthInput = st.number_input("Enter width", min_value=10, step=1, value=100)
    
    with col1:
        heightInput = st.number_input("Enter height", min_value=10, step=1, value=100)

    if uploaded_file is not None:
        col2.image(uploaded_file, caption="Uploaded Image", use_column_width=True)
        col2.write("")
        
        if st.button("Resize Image"):
            with st.spinner("Resize..."):
                url = "https://gy7n5q6gjg.execute-api.ap-southeast-1.amazonaws.com/prod/image"
                base64_data = base64.b64encode(uploaded_file.read()).decode("utf-8")

                fileName =  uploaded_file.name
                type= uploaded_file.type
                params={
                    "width" : widthInput,
                    "height": heightInput
                }
                data = {
                    "name":fileName,
                    "type":type,
                    "file":base64_data
                }
                response = requests.post(url, params=params, data=json.dumps(data))
            st.write("Status Code:", response.status_code)
            if(response.status_code==200):
                url = json.loads(response.text)["url"]
                st.write(f"<a href='{url}' target='_blank'>Click here to see the image!</a>", unsafe_allow_html=True)


if __name__ == "__main__":
    main()


