/*
 * 
 https://developers.google.com/recaptcha/docs/display
 
 */

/** Google Reacptcha Global Api Object */
declare var grecaptcha : IGoogleRecaptcha;

/** the api interface */
interface IGoogleRecaptcha {

//    Renders the container as a reCAPTCHA widget and returns the ID of the newly created widget.
//    container
//The HTML element to render the reCAPTCHA widget.Specify either the ID of the container(string) or the DOM element itself.
//    parameters
//An object containing parameters as key=value pairs, for example, { "sitekey": "your_site_key", "theme": "light" }.See grecaptcha.render parameters.

    /**
     * Renders the container as a reCAPTCHA widget and returns the ID of the newly created widget.
     * @param container The HTML element to render the reCAPTCHA widget.Specify either the ID of the container(string) or the DOM element itself.
     * @param parameters An object containing parameters as key=value pairs, for example, { "sitekey": "your_site_key", "theme": "light" }.See grecaptcha.render parameters.
     */
    render(container: string | HTMLElement, parameters?: {
        sitekey?: string;
        theme?: "dark" | "light";
        size?: "compact" | "normal";
        tabindex?: number;
        callback?: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;

    }): string;

    /**
     * Resets the reCAPTCHA widget.
     * @param opt_widget_id
     */
    reset(
        /** widget ID, defaults to the first widget created if unspecified */
        opt_widget_id?:string

    ):void;

    /**
     * Gets the response for the reCAPTCHA widget.
     * @param opt_widget_id
     * @returns the token if not pass the value will be empty string
     */
    getResponse(
        /** widget ID, defaults to the first widget created if unspecified */
        opt_widget_id?: string
    ) : string;
}