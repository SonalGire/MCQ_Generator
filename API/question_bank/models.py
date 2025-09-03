from django.db import models


class UploadedFile(models.Model):
    """Stores uploaded SOP/Document files for quiz generation"""
    file = models.FileField(upload_to="upload_files/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"File: {self.file.name} (Uploaded {self.uploaded_at.strftime('%Y-%m-%d %H:%M')})"


class UserQuizAnswer(models.Model):
    """Maps directly to existing tbl_quiz table in Postgres"""
    question = models.TextField()
    correct_answer = models.TextField()
    user_answer = models.TextField()
    ques_type = models.CharField(max_length=20)   # e.g. "MCQ", "True/False", "Yes/No"
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tbl_quiz"      # ✅ Use existing table
        managed = False            # ✅ Django won’t try to CREATE/ALTER it
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"Q: {self.question[:50]}... | User Answer: {self.user_answer[:30]}..."
