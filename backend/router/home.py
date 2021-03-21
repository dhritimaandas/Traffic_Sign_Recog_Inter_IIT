from flask_restful import Resource
from db import upload_base_model, load_latest_model_from_db

class Home(Resource):
    def post(self):
        # args = parser.parse_args()
        # # print(request)
        # images = args["images"]
        # print(images)
        ans = upload_base_model()
        return ans ,200
    def get(self):
        ans = load_latest_model_from_db()
        return ans,200