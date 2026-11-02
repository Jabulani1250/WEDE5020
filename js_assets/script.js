document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // EMAILJS INITIALIZATION
    // ==========================================

    if (window.emailjs) {
        emailjs.init({
            publicKey: "pPiKZdtWrbZhqUGPK"
        });
    }

    // ==========================================
    // ORDER FORM
    // ==========================================

    const orderForm = document.getElementById("orderForm");
    const productSelect = document.getElementById("product");
    const quantityInput = document.getElementById("quantity");

    const unitPriceDisplay = document.getElementById("unitPrice");
    const orderTotalDisplay = document.getElementById("orderTotal");

    // Run the order-form code only on pages containing the form.
    // This allows other page features, including the lightbox, to work.

    if (
        orderForm &&
        productSelect &&
        quantityInput &&
        unitPriceDisplay &&
        orderTotalDisplay
    ) {

        // Calculate the order total.
        function calculateTotal() {

            const selectedOption =
                productSelect.options[productSelect.selectedIndex];

            const price = Number(selectedOption.dataset.price) || 0;
            const quantity = Number(quantityInput.value) || 0;

            const total = price * quantity;

            unitPriceDisplay.textContent = "R" + price.toFixed(2);
            orderTotalDisplay.textContent = "R" + total.toFixed(2);
        }

        // Update prices when the product or quantity changes.
        productSelect.addEventListener("change", calculateTotal);
        quantityInput.addEventListener("input", calculateTotal);

        // Calculate the initial price.
        calculateTotal();

        // Handle form submission.
        orderForm.addEventListener("submit", async function (event) {

            console.log("Order form submitted - new script is running.");

            event.preventDefault();

            // Collect the customer's information.
            const customerName =
                document.getElementById("customerName").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const product = productSelect.value;

            const quantity = Number(quantityInput.value);

            const deliveryDate =
                document.getElementById("deliveryDate").value;

            const notes =
                document.getElementById("notes").value.trim();

            // Get the selected product's price.
            const selectedOption =
                productSelect.options[productSelect.selectedIndex];

            const price = Number(selectedOption.dataset.price) || 0;
            const total = price * quantity;

            // Validate required fields.
            if (
                customerName === "" ||
                email === "" ||
                phone === "" ||
                product === "" ||
                deliveryDate === ""
            ) {
                alert("Please complete all required fields.");
                return;
            }

            // Validate the quantity.
            if (!Number.isInteger(quantity) || quantity < 1) {
                alert("Please enter a valid quantity of at least 1.");
                return;
            }

            // Validate the selected product's price.
            if (price <= 0) {
                alert("Please select a product with a valid price.");
                return;
            }

            // Check whether EmailJS is available.
            if (!window.emailjs) {
                alert(
                    "The email service could not load. " +
                    "Please refresh the page and try again."
                );
                console.error("EmailJS library was not loaded.");
                return;
            }

            // Prepare the email template parameters.
            // These names must match the variables in your EmailJS template.
            const templateParams = {
                customer_name: customerName,
                email: email,
                phone: phone,
                product: product,
                quantity: quantity,
                unit_price: "R" + price.toFixed(2),
                total_price: "R" + total.toFixed(2),
                delivery_date: deliveryDate,
                notes: notes || "No additional instructions"
            };

            // Send the confirmation email through EmailJS.
            const submitButton =
                orderForm.querySelector('button[type="submit"]');

            try {

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = "Sending order...";
                }

                await emailjs.send(
                    "service_768b17e",
                    "template_qbcl5fe",
                    templateParams
                );

                // Show success only after EmailJS accepts the request.
                alert(
                    "Thank you, " + customerName + "!\n\n" +
                    "Your order confirmation email has been sent to " +
                    email + ".\n\n" +
                    "Product: " + product + "\n" +
                    "Quantity: " + quantity + "\n" +
                    "Total: R" + total.toFixed(2) + "\n" +
                    "Delivery Date: " + deliveryDate
                );

                // Reset the form and refresh the displayed prices.
                orderForm.reset();
                calculateTotal();

            } catch (error) {

                console.error("EmailJS error:", error);

                alert(
                    "Your order confirmation email could not be sent.\n\n" +
                    "Please check your internet connection and try again. " +
                    "If the problem continues, contact the bakery."
                );

            } finally {

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Place Order";
                }

            }

        });

    }

    // ==========================================
    // PRODUCT LIGHTBOX
    // ==========================================

    const lightbox = document.getElementById("product-lightbox");
    const lightboxImage = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeButton = document.querySelector(".lightbox-close");

    const productImages =
        document.querySelectorAll(".lightbox-image");

    // Only activate the lightbox when its required elements exist.
    if (
        lightbox &&
        lightboxImage &&
        lightboxCaption &&
        closeButton
    ) {

        // Open the lightbox when a product image is clicked.
        productImages.forEach(function (image) {

            image.addEventListener("click", function () {

                lightboxImage.src = image.src;
                lightboxImage.alt = image.alt;

                const productName =
                    image.parentElement.querySelector("h3");

                lightboxCaption.textContent = productName
                    ? productName.textContent
                    : image.alt;

                lightbox.classList.add("active");
                lightbox.setAttribute("aria-hidden", "false");

                document.body.style.overflow = "hidden";

                closeButton.focus();

            });

        });

        // Close the lightbox.
        function closeLightbox() {

            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");

            lightboxImage.src = "";
            lightboxCaption.textContent = "";

            document.body.style.overflow = "";

        }

        // Close using the X button.
        closeButton.addEventListener("click", closeLightbox);

        // Close when the background is clicked.
        lightbox.addEventListener("click", function (event) {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });

        // Close by pressing Escape.
        document.addEventListener("keydown", function (event) {

            if (
                event.key === "Escape" &&
                lightbox.classList.contains("active")
            ) {
                closeLightbox();
            }

        });

    }

});

