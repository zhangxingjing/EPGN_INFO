from django.test import TestCase

# Create your tests here.
import os
from settings.dev import BASE_DIR

print(os.path.join(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(
                os.path.dirname(
                    os.path.dirname(
                        os.path.dirname(BASE_DIR)
                    )
                )
            )
        )
    ), 'media/sf_Y_DRIVE/Database/Audio/'))