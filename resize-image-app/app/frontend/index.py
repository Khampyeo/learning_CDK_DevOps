import streamlit as st
import base64
import requests
import json


def main():
    st.title("Edit Image")

    col11, col12 = st.columns(2)
    col1, col2, col3 = st.columns([2,1,1])
    
    with col2:
        widthInput = st.number_input("Enter Width:", min_value=10, step=1, value=100)
        grayscale = st.radio("Remove Color:", [True, False], index=1)

        st.write("")
        btn = st.button("Edit Image", type="primary")

    with col3:
        heightInput = st.number_input("Enter Height:", min_value=10, step=1, value=100)
        crop = st.radio("Crop Image", [True, False], index=0)

        
    with col12:
        quality = st.slider("Image Quality:", min_value=1, max_value=100, value=100, step=1)
        type = st.radio("Save Image As:", ["png", "jpg","jpeg","original"], index=3, horizontal=True)
        

    
    uploaded_file = col11.file_uploader("Choose a image", type=["jpg", "jpeg", "png"])
    

    if uploaded_file is not None:
        

        col1.image(uploaded_file, caption="Uploaded Image", use_column_width=True)
        
        if btn:
            with st.spinner("Editting..."):
                url = "https://gy7n5q6gjg.execute-api.ap-southeast-1.amazonaws.com/prod/image"
                base64_data = base64.b64encode(uploaded_file.read()).decode("utf-8")
                fileName =  uploaded_file.name
                if type == "original":
                    type = uploaded_file.type.split("/")[1]
                    contentType= uploaded_file.type
                else:   
                    contentType = "image/" + type

                params={
                    "width" : widthInput,
                    "height": heightInput,
                    "grayscale":grayscale,
                    "quality":quality,
                    "crop":crop,
                    "type":type
                }
                data = {
                    "name":fileName,
                    "type":contentType,
                    "file":base64_data
                }

                response = requests.post(url, params=params, data=json.dumps(data))
            st.write("Status Code:", response.status_code)
            if(response.status_code==200):
                url = json.loads(response.text)["url"]
                st.write(f"<a href='{url}' target='_blank'>Click here to see the image!</a>", unsafe_allow_html=True)


if __name__ == "__main__":
    main()


