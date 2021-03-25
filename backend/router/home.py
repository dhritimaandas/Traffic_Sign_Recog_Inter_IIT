from flask_restful import Resource
from db import upload_base_model, load_latest_model_from_db

class Home(Resource):
    def get(self):
        ans = upload_base_model()
        return ans ,200
    def post(self):
        ans = load_latest_model_from_db()
        return ans,200