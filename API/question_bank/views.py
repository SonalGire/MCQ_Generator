from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import os
import asyncio
from .utils.Rag_pipeline import *
from .models import UserQuizAnswer

class GenerateQuestions(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            file_path = request.data.get("file_path")
            uploaded_file = request.FILES.get("file")
            options_per_question = request.data.get("options_per_question")

            # Validate that at least one file input exists
            if not uploaded_file and not file_path:
                return Response({"error": "Please provide either a file upload or a file path."},
                                status=status.HTTP_400_BAD_REQUEST)

            #  Normalize and check file path if provided
            if file_path:
                file_path = os.path.normpath(file_path)
                if not os.path.exists(file_path):
                    return Response({"error": f"File path does not exist: {file_path}"},
                                    status=status.HTTP_400_BAD_REQUEST)

            #  If file uploaded, override file_path
            if uploaded_file:
                upload_dir = "uploaded_files"
                os.makedirs(upload_dir, exist_ok=True)
                file_path = os.path.join(upload_dir, uploaded_file.name)

                with open(file_path, "wb") as f:
                    for chunk in uploaded_file.chunks():
                        f.write(chunk)
            try:
                # Run async function properly
                result = asyncio.run(generate_mcqs_from_file(file_path, options_per_question))
            finally:
                if uploaded_file and os.path.exists(file_path):
                    os.remove(file_path)

            if "error" in result:
                return Response({"error": result["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({
                "message": "MCQs generated successfully.",
                "file_id": result["file_id"],
                "quiz": result["quiz"]
            }, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": f"Unexpected error: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SubmitAnswers(APIView):
    def post(self, request):
        answers = request.data.get('answers', [])

        if not answers:
            return Response({"error": "No answers provided"}, status=status.HTTP_400_BAD_REQUEST)

        total_score = 0

        for item in answers:
            question = item.get('question')
            correct = item.get('correct_answer')
            user_ans = item.get('user_answer')
            qtype = item.get('ques_type')

            # Normalize both answers
            correct_set = set([str(c).strip().lower() for c in (correct if isinstance(correct, list) else [correct])])
            user_set = set([str(u).strip().lower() for u in (user_ans if isinstance(user_ans, list) else [user_ans])])

            #  Scoring logic
            if user_set == correct_set:
                total_score += 1

            #  Save response
            UserQuizAnswer.objects.create(
                question=question,
                correct_answer=correct,
                user_answer=user_ans,
                ques_type=qtype
            )

        return Response({"message": "Answers submitted successfully", "score": total_score}, status=200)
