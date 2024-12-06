<?php
class ControllerCaptcha extends Controller {
    public function FctDegueulasse($methode) {
        $managerQuestion = new CaptchaDAO();
        $question = $managerQuestion->getQuestion();
        $template = $twig->load('captcha.html.twig');
        echo $template->render(array());
    }
}
?>