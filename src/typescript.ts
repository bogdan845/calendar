import * as $ from "jquery";

function typeScript(): object  {

    const greet = () : string => "typescript works";

    $(document).on("click", greet);

    return {
        jk() {
            return "typescript test"
        }
    }
}

window["typescript"] = typeScript();