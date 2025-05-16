import React from "react";

export const WarehouseManagement = () => {
  return (
    <>
      <section className="bg-white py-20 lg:py-[120px] overflow-hidden relative z-10 p-5">
        <div className="container">
          <div className="flex flex-wrap -mx-4 lg:justify-between">
            <div className="w-full px-4 lg:w-1/2 xl:w-6/12">
              <div className="mb-12 max-w-[570px] lg:mb-0">
                <span className="block mb-4 text-base font-semibold text-primary">
                  Warehouse Management
                </span>
                <h2 className="mb-6 text-[32px] font-bold uppercase text-dark sm:text-[40px] lg:text-[36px] xl:text-[40px]">
                  MANAGE YOUR PRODUCTS
                </h2>
                <p className="text-base leading-relaxed mb-9 text-body-color">
                  Use this page to add, edit, delete, and update product information in your warehouse. Keep your inventory organized and up-to-date.
                </p>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div className="relative p-8 bg-white rounded-lg shadow-lg sm:p-12">
                <form>
                  <WarehouseInputBox
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                  />
                  <WarehouseInputBox
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                  />
                  <WarehouseInputBox
                    type="text"
                    name="price"
                    placeholder="Price"
                  />
                  <WarehouseTextArea
                    row="4"
                    placeholder="Product Description"
                    name="description"
                    defaultValue=""
                  />
                  <div>
                    <button
                      type="submit"
                      className="w-full p-3 text-white transition border rounded border-primary bg-primary hover:bg-opacity-90 bg-blue-800"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
                <div>
                  <span className="absolute -top-10 -right-9 z-[-1]">
                    {/* Decorative SVG */}
                  </span>
                  <span className="absolute -right-10 top-[90px] z-[-1]">
                    {/* Decorative SVG */}
                  </span>
                  <span className="absolute -left-7 -bottom-7 z-[-1]">
                    {/* Decorative SVG */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WarehouseManagement;

const WarehouseTextArea = ({ row, placeholder, name, defaultValue }) => {
  return (
    <>
      <div className="mb-6">
        <textarea
          rows={row}
          placeholder={placeholder}
          name={name}
          className="border-[f0f0f0] w-full resize-none rounded border py-3 px-[14px] text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
          defaultValue={defaultValue}
        />
      </div>
    </>
  );
};

const WarehouseInputBox = ({ type, placeholder, name }) => {
  return (
    <>
      <div className="mb-6">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          className="border-[f0f0f0] w-full rounded border py-3 px-[14px] text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
        />
      </div>
    </>
  );
};
