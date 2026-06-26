import numpy as np
from sklearn.metrics import(f1_score,hamming_loss)

def precision_at_k(y_true,y_prob,k=5):
    precisions = []
    if y_true.shape != y_prob.shape:
        raise ValueError(
            f"Shape mismatch: y_true {y_true.shape}, y_prob {y_prob.shape}"
        )

    for true_row,prob_row in zip(y_true,y_prob):
        top_k = np.argsort(prob_row)[-k:] # sort the data based on probablities and get top k crops
        precision = ( true_row[top_k].sum()/ k)
        precisions.append(precision)

    return np.mean(precisions)

def evaluate_model(model,X,y):
    y_pred = model.predict(X)
    classifier = model.named_steps["classifier"]
    X_processed = model.named_steps["preprocessor"].transform(X)
    y_prob = np.column_stack([
        estimator.predict_proba(X_processed)[:,1]
        for estimator in classifier.estimators_
    ])
    return {
        "micro_f1": float(
            f1_score(
                y,
                y_pred,
                average="micro"
            )
        ),

        "macro_f1": float(
            f1_score(
                y,
                y_pred,
                average="macro"
            )
        ),

        "hamming_loss": float(
            hamming_loss(
                y,
                y_pred
            )
        ),

        "precision_at_5": float(
            precision_at_k(
                y,
                y_prob,
                k=5
            )
        )
    }